/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Combobox,
  InputBase,
  Loader,
  ScrollArea,
  useCombobox,
} from '@mantine/core';
import { TbX } from 'react-icons/tb';

import styles from '../ManageSong.module.css';
import { useSongFormContext } from '../lib/formContext';

interface RenderRightSectionProps {
  loading: boolean;
  value: string;
  disallowClear: boolean;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  name: string;
}

// eslint-disable-next-line react/display-name
const RenderRightSection: React.FC<RenderRightSectionProps> = React.memo(
  ({ loading, value, disallowClear, setSearch, name }) => {
    const form = useSongFormContext();

    if (loading) {
      return <Loader color="gray.4" size={18} />;
    }

    if (value && !disallowClear) {
      return (
        <Combobox.ClearButton
          onClear={() => {
            setSearch('');
            form.setFieldValue(name, '');
          }}
          icon={<TbX color="inherit" />}
        />
      );
    }

    return <Combobox.Chevron />;
  },
);

interface CreatableSelectProps {
  data: string[] | undefined;
  loading: boolean;
  name: string;
  label: string;
  disallowClear?: boolean;
  t: TransFunction;
}

// eslint-disable-next-line react/display-name
const CreatableSelect: React.FC<CreatableSelectProps> = React.memo(
  ({ data, loading, name, label, disallowClear = false, t }) => {
    const form = useSongFormContext();

    const [cachedData, setCachedData] = useState<string[] | undefined>(data);
    const combobox = useCombobox({
      onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const value = form.values[name as keyof typeof form.values] as string;
    const [search, setSearch] = useState<string>('');

    useEffect(() => {
      if (
        data !== cachedData &&
        (cachedData?.length || 0) < (data?.length || 0)
      ) {
        setCachedData(data);
      }
    }, [data, cachedData]);

    const exactOptionMatch = useMemo(
      () => cachedData?.some((item) => item === search),
      [cachedData, search],
    );

    const filteredOptions = useMemo(() => {
      if (exactOptionMatch) {
        return cachedData;
      }
      return cachedData?.filter((item) =>
        item?.toLowerCase().includes(search.toLowerCase().trim()),
      );
    }, [cachedData, exactOptionMatch, search]);

    const sortedOptions = useMemo(
      () => filteredOptions?.sort((a, b) => a.localeCompare(b)),
      [filteredOptions],
    );

    const options = useMemo(
      () =>
        sortedOptions?.map((item) => (
          <Combobox.Option
            value={item}
            key={item}
            className={styles.option}
            onClick={() => combobox.closeDropdown()}
          >
            {item}
          </Combobox.Option>
        )),
      [sortedOptions, combobox],
    );

    const handleOptionSubmit = useCallback(
      (val: string) => {
        if (val === '$create') {
          setCachedData((prev) => (prev ? [...prev, search] : [search]));
          form.setFieldValue(name, search);
        } else {
          setSearch(val);
          form.setFieldValue(name, val);
        }
      },
      [form, name, search],
    );

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        combobox.openDropdown();
        combobox.updateSelectedOptionIndex();
        setSearch(event.currentTarget.value);
      },
      [combobox],
    );

    const handleBlur = useCallback(() => {
      combobox.closeDropdown();
      setSearch(value || '');
    }, [combobox, value]);

    const handleOpenDropdown = useCallback(() => {
      combobox.openDropdown();
    }, [combobox]);

    return useMemo(
      () => (
        <Combobox
          store={combobox}
          withinPortal={false}
          onOptionSubmit={handleOptionSubmit}
        >
          <Combobox.Target>
            <InputBase
              rightSection={
                <RenderRightSection
                  loading={loading}
                  value={value}
                  disallowClear={disallowClear}
                  setSearch={setSearch}
                  name={name}
                />
              }
              value={search || value || ''}
              onChange={handleChange}
              onClick={handleOpenDropdown}
              onFocus={handleOpenDropdown}
              onBlur={handleBlur}
              placeholder={t('search')}
              error={t(`${form.errors?.[name] ?? ''}`)}
              label={label}
              w="100%"
            />
          </Combobox.Target>

          <Combobox.Dropdown bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-7))">
            <ScrollArea>
              <Combobox.Options mah="350">
                {options}
                {!exactOptionMatch && search.trim().length > 0 && (
                  <Combobox.Option value="$create">
                    {`+ ${t('create')} "${search}"`}
                  </Combobox.Option>
                )}
                {!filteredOptions?.length && !search && (
                  <Combobox.Empty>{t('nothingFound')}</Combobox.Empty>
                )}
              </Combobox.Options>
            </ScrollArea>
          </Combobox.Dropdown>
        </Combobox>
      ),
      [
        combobox,
        value,
        loading,
        search,
        handleOptionSubmit,
        handleChange,
        handleBlur,
        handleOpenDropdown,
        options,
        exactOptionMatch,
        filteredOptions,
      ],
    );
  },
);

export default CreatableSelect;
