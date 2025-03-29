import { ChangeEvent } from 'react';
import { CloseButton, TextInput, useMantineTheme } from '@mantine/core';

export default function ModifiableTextInput({
  value, setValue, originalValue, error,
}: {
  value: string
  setValue: (event: string) => void
  originalValue: string
  error?: string
}) {
  const theme = useMantineTheme();
  const modified = value !== originalValue;

  const onChange = (event: ChangeEvent<any>) => {
    setValue(event.currentTarget.value);
  };

  return (
    <TextInput
      error={error ?? modified ? `Modified from "${originalValue}" to "${value}"` : undefined}
      errorProps={error != null ? undefined : { style: { color: theme.colors.blue[5] } }}
      style={error != null ? undefined : { borderColor: theme.colors.blue[5] }}
      withErrorStyles={error == null}
      value={value}
      onChange={onChange}
      rightSection={(
        <CloseButton
          aria-label="Clear input"
          onClick={() => setValue(originalValue)}
          style={{ display: modified ? undefined : 'none' }}
        />
    )}
    />
  );
}
