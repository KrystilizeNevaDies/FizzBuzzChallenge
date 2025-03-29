import { Badge } from '@mantine/core';

const type2color = {
  bool: 'brown',
  string: 'green',
  number: 'cyan',
};

const type2name = {
  bool: 'Boolean',
  string: 'String',
  number: 'Number',
};

export default function ElementTypeBadge({ type }: { type: 'bool' | 'string' | 'number'}) {
  return (
    <Badge
      color={type2color[type]}
      style={{
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
      size="lg"
      radius="xs"
      maw={256}
    >
      {type2name[type]}
    </Badge>
  );
}
