import React from 'react';
import { Factory } from 'rosie';
import {
  render, initializeTestStore, screen, fireEvent,
} from '../../setupTest';
import SidebarNotificationButton from './SidebarNotificationButton';

describe('Sidebar Notification Button', () => {
  let mockData;
  const courseMetadata = Factory.build('courseMetadata');

  beforeAll(async () => {
    await initializeTestStore({ courseMetadata, excludeFetchCourse: true, excludeFetchSequence: true });
    mockData = {
      toggleSidebar: () => {},
      isSidebarVisible: () => {},
    };
  });

  it('renders sidebar notification button with icon', async () => {
    const { container } = render(<SidebarNotificationButton {...mockData} />);
    expect(container).toBeInTheDocument();
    const buttonIcon = container.querySelectorAll('svg');
    expect(buttonIcon).toHaveLength(1);

    // REV-2130 TODO: update below test once the status=active or inactive is implemented
    expect(screen.getByTestId('notification-dot')).toBeInTheDocument();
  });

  it('handles onClick event toggling the sidebar', async () => {
    const toggleSidebar = jest.fn();
    const testData = {
      ...mockData,
      toggleSidebar,
    };
    render(<SidebarNotificationButton {...testData} />);

    const sidebarOpenButton = screen.getByRole('button', { name: /Show sidebar notification/i });
    expect(sidebarOpenButton).toBeInTheDocument();
    fireEvent.click(sidebarOpenButton);
    expect(toggleSidebar).toHaveBeenCalledTimes(1);
  });
});
