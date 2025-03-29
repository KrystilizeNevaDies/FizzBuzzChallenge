import { Menu } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faBook, faRedo } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export default function ElementMenu({
  label, children, onRemove, onReset,
}: {
  label: string
  children: React.JSX.Element
  onRemove: () => void
  onReset: () => void
}) {
  return (
    <Menu shadow="md" width={200} closeDelay={500} closeOnItemClick closeOnClickOutside>
      <Menu.Target>
        {children}
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{label}</Menu.Label>
        <Menu.Item leftSection={<FontAwesomeIcon icon={faTrash} />} onClick={onRemove}>
          Remove
        </Menu.Item>
        <Menu.Item leftSection={<FontAwesomeIcon icon={faBook} />}>
          Info
        </Menu.Item>
        <Menu.Item leftSection={<FontAwesomeIcon icon={faRedo} />} onReset={onReset}>
          Reset
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
