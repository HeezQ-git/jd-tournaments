import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  CheckIcon,
  Combobox,
  Group,
  Loader,
  Pill,
  PillsInput,
  useCombobox,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

import styles from '../ManageSong.module.css';

interface MultiSelectProps {
  data?: string[];
  form: UseFormReturnType<any>;
  name: any;
  label: string;
  loading?: boolean;
  t: TransFunction;
}

// eslint-disable-next-line react/display-name
const MultiSelect: React.FC<MultiSelectProps> = React.memo(
  ({ data = [], form, name, label, loading = false, t }) => {
    const combobox = useCombobox({
      onDropdownClose: () => combobox.resetSelectedOption(),
      onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
    });

    const [cachedData, setCachedData] = useState<string[]>(data);
    const [search, setSearch] = useState<string>('');
    const value: string[] = form.values[name] || [];

    const exactOptionMatch = useMemo(
      () =>
        cachedData.some((item) => item.toLowerCase() === search.toLowerCase()),
      [cachedData, search],
    );

    const filteredOptions = useMemo(() => {
      if (exactOptionMatch) {
        return cachedData;
      }
      return cachedData.filter((item) =>
        item.toLowerCase().includes(search.toLowerCase().trim()),
      );
    }, [cachedData, exactOptionMatch, search]);

    const sortedOptions = useMemo(
      () => filteredOptions.sort((a, b) => a.localeCompare(b)),
      [filteredOptions],
    );

    const options = useMemo(
      () =>
        sortedOptions.map((item) => (
          <Combobox.Option
            value={item}
            key={item}
            active={value.includes(item)}
            className={styles.option}
          >
            <Group justify="space-between" wrap="nowrap">
              <Group gap="xs">
                {value.includes(item) && <CheckIcon size={12} />}
                <span>{item}</span>
              </Group>
            </Group>
          </Combobox.Option>
        )),
      [sortedOptions, value],
    );

    const handleValueSelect = useCallback(
      (val: string) => {
        setSearch('');

        if (val === '$create') {
          form.setFieldValue(name, [...value, search]);
          setCachedData((prev) => (prev ? [...prev, search] : [search]));
        } else {
          const newValue = value.includes(val)
            ? value.filter((v) => v !== val)
            : [...value, val];

          form.setFieldValue(name, newValue);
        }
      },
      [form, name, search, value],
    );

    const handleValueRemove = useCallback(
      (val: string) => {
        form.setFieldValue(
          name,
          value.filter((v) => v !== val),
        );
      },
      [form, name, value],
    );

    const pills = useMemo(
      () =>
        value.map((item) => (
          <Pill
            key={item}
            withRemoveButton
            onRemove={() => handleValueRemove(item)}
            color="blue"
          >
            {item}
          </Pill>
        )),
      [value, handleValueRemove],
    );

    useEffect(() => {
      if (
        data !== cachedData &&
        (cachedData?.length || 0) < (data?.length || 0)
      ) {
        setCachedData(data);
      }
    }, [data, cachedData]);

    return useMemo(
      () => (
        <Combobox
          store={combobox}
          onOptionSubmit={handleValueSelect}
          withinPortal={false}
        >
          <Combobox.DropdownTarget>
            <PillsInput
              onClick={() => combobox.openDropdown()}
              rightSection={loading && <Loader size={18} color="gray.5" />}
              error={t(`${form.errors?.[name] ?? ''}`)}
              label={label}
            >
              <Pill.Group>
                {pills}

                <Combobox.EventsTarget>
                  <PillsInput.Field
                    onFocus={() => combobox.openDropdown()}
                    onBlur={() => combobox.closeDropdown()}
                    value={search}
                    placeholder={`${t('select')} ${t(`song.placeholder.${name}`)}`}
                    onChange={(event) => {
                      combobox.updateSelectedOptionIndex();
                      setSearch(event.currentTarget.value);
                    }}
                    onKeyDown={(event) => {
                      if (
                        event.key === 'Backspace' &&
                        search.length === 0 &&
                        value.length > 0
                      ) {
                        event.preventDefault();
                        handleValueRemove(value[value.length - 1]);
                      }
                    }}
                  />
                </Combobox.EventsTarget>
              </Pill.Group>
            </PillsInput>
          </Combobox.DropdownTarget>

          <Combobox.Dropdown bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-7))">
            <Combobox.Options mah="250" style={{ overflowY: 'auto' }}>
              {options}

              {!exactOptionMatch && search.trim().length > 0 && (
                <Combobox.Option value="$create">
                  {`+ ${t('create')} "${search}"`}
                </Combobox.Option>
              )}

              {(exactOptionMatch && !search.trim() && !options.length) ||
              (!cachedData.length && !search.trim()) ? (
                <Combobox.Empty>{t('nothingFound')}</Combobox.Empty>
              ) : null}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
      ),
      [
        combobox,
        handleValueRemove,
        handleValueSelect,
        loading,
        options,
        pills,
        search,
        t,
        value,
      ],
    );
  },
);

export default MultiSelect;
