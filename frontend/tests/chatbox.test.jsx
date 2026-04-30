import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatBox from '../components/ChatBox';

vi.mock('../utils/api', () => ({
  askAssistant: vi.fn(),
}));

vi.mock('../utils/firebase', () => ({
  logEvent: vi.fn(),
}));

import { askAssistant } from '../utils/api';

describe('ChatBox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends user message and renders assistant reply', async () => {
    askAssistant.mockResolvedValue({ reply: 'You can vote using EVM and verify VVPAT.' });

    render(<ChatBox region="national" />);

    const input = screen.getByLabelText('Ask your election question');
    await userEvent.type(input, 'How do I vote?');
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => {
      expect(askAssistant).toHaveBeenCalledWith('How do I vote?', 'national');
    });

    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('You can vote using EVM and verify VVPAT.')).toBeInTheDocument();
  });
});
