import { Flex, TextInput, Select, ActionIcon, Checkbox } from '@mantine/core';
import { FilterQueryFields, useUserListStore } from '@/stores/userListStore';
import { useClickOutside } from '@mantine/hooks';
import { useMemo } from 'react';
import { TbFilter, TbSearch, TbX } from 'react-icons/tb';
//
import { useUserListFilters } from './hooks/useUserFilters';

type FieldFilterOptionProps = {
  fieldName: FilterQueryFields;
  t: TransFunction;
  close: () => void;
  isBoolean?: boolean;
};

export function FieldFilterOption({
  fieldName,
  t,
  close,
  isBoolean,
}: FieldFilterOptionProps) {
  // must be imported here, because for some reason
  // useUserListFilters does not acknowledge the store changes
  const { users, filters } = useUserListStore();
  const ref = useClickOutside(close);

  const { updateField } = useUserListFilters(users, filters);

  const filterOptions = useMemo(
    () =>
      !isBoolean
        ? [
            {
              value: 'startsWith',
              label: t('list.filters.options.startsWith'),
            },
            { value: 'endsWith', label: t('list.filters.options.endsWith') },
            { value: 'contains', label: t('list.filters.options.contains') },
            { value: 'equals', label: t('list.filters.options.equals') },
            { value: 'notEquals', label: t('list.filters.options.notEquals') },
          ]
        : [{ value: 'isBool', label: t('list.filters.options.isBool') }],
    [],
  );

  const SelectFilter = useMemo(
    () => (
      <Select
        data={filterOptions}
        value={filters[fieldName].filter}
        onChange={(value) => updateField(fieldName, 'filter', value)}
        placeholder={t('list.filters.options.placeholder')}
        leftSection={<TbFilter />}
        comboboxProps={{ withinPortal: false }}
        allowDeselect
        clearable
        rightSection={
          filters[fieldName].filter && (
            <ActionIcon
              variant="transparent"
              color="gray"
              onClick={() => updateField(fieldName, 'filter', null)}
            >
              <TbX />
            </ActionIcon>
          )
        }
      />
    ),
    [filters[fieldName].filter],
  );

  const QueryInput = useMemo(
    () => (
      <TextInput
        placeholder={t(`list.filters.search.${fieldName}.placeholder`)}
        value={filters[fieldName].query}
        onChange={(event) =>
          updateField(fieldName, 'query', event.target.value)
        }
        leftSection={<TbSearch />}
        rightSection={
          filters[fieldName].query && (
            <ActionIcon
              variant="transparent"
              color="gray"
              onClick={() => updateField(fieldName, 'query', '')}
            >
              <TbX />
            </ActionIcon>
          )
        }
      />
    ),
    [filters[fieldName].query],
  );

  const CaseSensitiveCheckbox = useMemo(
    () => (
      <Checkbox
        checked={filters[fieldName].caseSensitive}
        label={t('list.filters.options.caseSensitive')}
        onChange={(event) =>
          updateField(fieldName, 'caseSensitive', event.currentTarget.checked)
        }
      />
    ),
    [filters[fieldName].caseSensitive],
  );

  const BooleanSelectElement = useMemo(
    () => (
      <Select
        data={[
          {
            value: 'boolTrue',
            label: t(`list.filters.options.${fieldName}.true`),
          },
          {
            value: 'boolFalse',
            label: t(`list.filters.options.${fieldName}.false`),
          },
        ]}
        value={filters[fieldName].filter}
        onChange={(value) => updateField(fieldName, 'filter', value)}
        placeholder={t('list.filters.options.placeholder')}
        leftSection={<TbFilter />}
        comboboxProps={{ withinPortal: false }}
        allowDeselect
        clearable
        rightSection={
          filters[fieldName].filter && (
            <ActionIcon
              variant="transparent"
              color="gray"
              onClick={() => updateField(fieldName, 'filter', null)}
            >
              <TbX />
            </ActionIcon>
          )
        }
      />
    ),
    [filters[fieldName].filter],
  );

  return (
    <Flex direction="column" gap="sm" ref={ref}>
      {!isBoolean ? (
        <>
          {SelectFilter}
          {QueryInput}
          {CaseSensitiveCheckbox}
        </>
      ) : (
        BooleanSelectElement
      )}
    </Flex>
  );
}
