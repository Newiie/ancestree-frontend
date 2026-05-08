import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Lightbox from '@/app/dashboard/my-records/_components/Lightbox'

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        const { fill: _fill, ...rest } = props
        return <img {...rest} />
    },
}))

const photos = [
    { key: 'a', url: 'http://x/a.jpg' },
    { key: 'b', url: 'http://x/b.jpg' },
    { key: 'c', url: 'http://x/c.jpg' },
]

describe('Lightbox', () => {
    it('shows the photo at startIndex', () => {
        render(<Lightbox photos={photos} startIndex={1} onClose={() => {}} />)
        expect(screen.getByText('2 of 3')).toBeInTheDocument()
        expect(screen.getByRole('img')).toHaveAttribute('src', 'http://x/b.jpg')
    })

    it('advances on right arrow key', () => {
        render(<Lightbox photos={photos} startIndex={0} onClose={() => {}} />)
        fireEvent.keyDown(window, { key: 'ArrowRight' })
        expect(screen.getByText('2 of 3')).toBeInTheDocument()
    })

    it('goes back on left arrow key', () => {
        render(<Lightbox photos={photos} startIndex={2} onClose={() => {}} />)
        fireEvent.keyDown(window, { key: 'ArrowLeft' })
        expect(screen.getByText('2 of 3')).toBeInTheDocument()
    })

    it('does not advance past the last photo', () => {
        render(<Lightbox photos={photos} startIndex={2} onClose={() => {}} />)
        fireEvent.keyDown(window, { key: 'ArrowRight' })
        expect(screen.getByText('3 of 3')).toBeInTheDocument()
    })

    it('calls onClose when Escape is pressed', () => {
        const onClose = jest.fn()
        render(<Lightbox photos={photos} startIndex={0} onClose={onClose} />)
        fireEvent.keyDown(window, { key: 'Escape' })
        expect(onClose).toHaveBeenCalled()
    })

    it('shows the album name when provided', () => {
        render(<Lightbox photos={photos} startIndex={0} albumName="Family Reunion" onClose={() => {}} />)
        expect(screen.getByText('Family Reunion')).toBeInTheDocument()
    })

    it('renders Edit and Delete buttons only when handlers provided', () => {
        const { rerender } = render(<Lightbox photos={photos} startIndex={0} onClose={() => {}} />)
        expect(screen.queryByRole('button', { name: /edit/i })).toBeNull()
        rerender(<Lightbox photos={photos} startIndex={0} onClose={() => {}} onEdit={() => {}} onDelete={async () => {}} />)
        expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    })
})
