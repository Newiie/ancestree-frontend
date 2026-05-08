import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UploadDialog from '@/app/dashboard/my-records/_components/UploadDialog'

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        return <img {...props} />
    },
}))

const mockUpload = jest.fn()
jest.mock('@/services/api/galleryService', () => ({
    __esModule: true,
    default: {
        uploadPhoto: (...args: unknown[]) => mockUpload(...args),
    },
}))

jest.mock('@/providers/RecordsProvider', () => ({
    useRecords: () => ({ setIsFetching: jest.fn() }),
}))

jest.mock('sonner', () => ({
    toast: { success: jest.fn(), error: jest.fn() },
}))

const makeFile = (name: string, type = 'image/png', size = 1000) => {
    const f = new File(['x'.repeat(size)], name, { type })
    return f
}

describe('UploadDialog', () => {
    beforeEach(() => {
        mockUpload.mockReset()
    })

    it('shows the empty dropzone when first opened', () => {
        render(
            <UploadDialog
                open={true}
                onOpenChange={() => {}}
                albumId="a1"
                albumName="Test"
                onComplete={() => {}}
            />
        )
        expect(screen.getByText(/drop photos here/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /upload/i })).toBeDisabled()
    })

    it('filters out non-image files when dropping', () => {
        const onChange = jest.fn()
        render(
            <UploadDialog
                open={true}
                onOpenChange={onChange}
                albumId="a1"
                albumName="Test"
                onComplete={() => {}}
            />
        )
        const dropzone = screen.getByTestId('upload-dropzone')
        const dataTransfer = {
            files: [makeFile('a.png', 'image/png'), makeFile('b.pdf', 'application/pdf')],
        }
        fireEvent.drop(dropzone, { dataTransfer })

        // Only a.png should appear; b.pdf is silently filtered
        expect(screen.getByText('1 photo selected')).toBeInTheDocument()
    })

    it('rejects files exceeding the size cap', () => {
        render(
            <UploadDialog
                open={true}
                onOpenChange={() => {}}
                albumId="a1"
                albumName="Test"
                onComplete={() => {}}
            />
        )
        const dropzone = screen.getByTestId('upload-dropzone')
        // 11MB > 10MB cap
        const big = makeFile('big.png', 'image/png', 11 * 1024 * 1024)
        fireEvent.drop(dropzone, { dataTransfer: { files: [big] } })
        expect(screen.getByText(/too large/i)).toBeInTheDocument()
    })

    it('uploads each file sequentially when Upload is clicked', async () => {
        mockUpload.mockResolvedValue({ ok: true })
        const onComplete = jest.fn()
        render(
            <UploadDialog
                open={true}
                onOpenChange={() => {}}
                albumId="a1"
                albumName="Test"
                onComplete={onComplete}
            />
        )
        const dropzone = screen.getByTestId('upload-dropzone')
        fireEvent.drop(dropzone, {
            dataTransfer: {
                files: [makeFile('1.png'), makeFile('2.png'), makeFile('3.png')],
            },
        })
        fireEvent.click(screen.getByRole('button', { name: /upload 3 photos/i }))
        await waitFor(() => expect(mockUpload).toHaveBeenCalledTimes(3))
        expect(onComplete).toHaveBeenCalledTimes(1)
    })
})
