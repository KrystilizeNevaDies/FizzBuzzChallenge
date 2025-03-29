import { Menu } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import React from 'react';

export default function SelectionMenu<T extends string>({
  label, children, onSelect, options,
}: {
  label: string
  children: React.JSX.Element
  onSelect: (type: T) => void
  options: { id: T, displayName: string, icon: IconProp, color: string }[]
}) {
  return (
    <Menu shadow="md" width={200} closeDelay={500} closeOnItemClick closeOnClickOutside>
      <Menu.Target>
        {children}
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{label}</Menu.Label>
        {options.map(({
          id, displayName, icon, color,
        }) => (
          <Menu.Item key={id} c={color} leftSection={<FontAwesomeIcon icon={icon} />} onClick={() => onSelect(id)}>
            {displayName}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
