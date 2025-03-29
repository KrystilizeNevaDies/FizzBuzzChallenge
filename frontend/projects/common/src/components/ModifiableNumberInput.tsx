import { CloseButton, NumberInput, useMantineTheme } from '@mantine/core';

export default function ModifiableNumberInput({
  value, setValue, originalValue, positiveOnly, error,
}: {
  value: number
  setValue: (event: number) => void
  originalValue: number
  positiveOnly: boolean
  error?: string
}) {
  const theme = useMantineTheme();
  const modified = value !== originalValue;

  const onChange = (value: string | number) => {
    let numValue;
    if (typeof value === 'number') {
      numValue = value;
    } else {
      numValue = parseFloat(value);
      if (Number.isNaN(numValue)) {
        return;
      }
    }
    setValue(numValue);
  };

  return (
    <NumberInput
      error={error ?? (modified ? `Modified from "${originalValue}" to "${value}"` : undefined)}
      errorProps={error != null ? undefined : { style: { color: theme.colors.blue[5] } }}
      style={error != null ? undefined : { borderColor: theme.colors.blue[5] }}
      withErrorStyles={error == null}
      value={value}
      onChange={onChange}
      allowNegative={!positiveOnly}
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
