import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import App from './App'

it('renders the current welcome message', () => {
  render(<App />)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
