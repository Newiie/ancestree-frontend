"use client";

import React, { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';

export default function ClientErrorBoundaryWrapper({ children }: { children: ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
