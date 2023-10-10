import { useState, useRef, useCallback, useMemo } from "react";
import { Button, ScrollArea, TextField } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";
import { useSearchParams } from "react-router-dom";

import { MultiSelectContainer } from "./MultiSelect.Container";
import { SelectOption } from "./MultiSelect.Option";
import MultiSelectOverlay from "./MultiSelect.Overlay";

type MultiSelectProps = {
    optionsRemoteAddress: string;
};

const MultiSelect = ({ optionsRemoteAddress }: MultiSelectProps) => {
    const {
        isLoading,
        isError,
        data: options,
        refetch
    } = useQuery({
        queryKey: ["options"],
        queryFn: () => fetchOptions(optionsRemoteAddress),
        retry: 2
    });

    const [searchParams, setSearchParams] = useSearchParams();

    const initialOptionsSet = new Set(searchParams.getAll("option"));
    const selectedOptionsRef = useRef<Set<string>>(initialOptionsSet);
    const [filterText, setFilterText] = useState("");

    const fuse = useMemo(
        () =>
            new Fuse(options || [], {
                threshold: 0.3
            }),
        [options]
    );

    const results = filterText ? fuse.search(filterText).map(({ item }) => item) : options;

    const handleSearch = useCallback(() => {
        const params = Array.from(selectedOptionsRef.current)
            .map(option => `option=${encodeURIComponent(option)}`)
            .join("&");

        setSearchParams(`?${params}`);

        console.log("searching", selectedOptionsRef.current);
        alert(`Searching for ${JSON.stringify([...selectedOptionsRef.current])} options`);
    }, [setSearchParams]);

    const handleOptionCheckedChange = useCallback((optionValue: string, checked: boolean) => {
        if (!checked && selectedOptionsRef.current.has(optionValue)) {
            selectedOptionsRef.current.delete(optionValue);
        } else if (checked) {
            selectedOptionsRef.current.add(optionValue);
        }
    }, []);

    return (
        <MultiSelectContainer loading={isLoading}>
            {isError ? (
                <MultiSelectOverlay>
                    <div className='flex flex-col opacity-100 text-center text-sm'>
                        Failed to load data
                        <br />
                        <br />
                        <Button
                            variant='solid'
                            onClick={() =>
                                refetch({
                                    type: "active"
                                })
                            }>
                            Retry
                        </Button>
                    </div>
                </MultiSelectOverlay>
            ) : null}

            <>
                <TextField.Root>
                    <TextField.Slot>
                        <MagnifyingGlassIcon height='16' width='16' />
                    </TextField.Slot>
                    <TextField.Input placeholder='Search the categories' value={filterText} onChange={e => setFilterText(e.target.value)} />
                </TextField.Root>
                <br />
                <ScrollArea type='always' scrollbars='vertical' style={{ height: 250, width: 300 }}>
                    {[...selectedOptionsRef.current].map((option: string) => (
                        <SelectOption defaultChecked={true} key={option} label={option} onCheckedChange={handleOptionCheckedChange} />
                    ))}
                    {results?.map((option: string) => (
                        <SelectOption hidden={initialOptionsSet.has(option)} key={option} label={option} onCheckedChange={handleOptionCheckedChange} />
                    ))}
                </ScrollArea>
                <br />
                <Button className='mt-4 w-full' onClick={handleSearch}>
                    Search
                </Button>
            </>
        </MultiSelectContainer>
    );
};

const fetchOptions = async (url: string) => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Network response was not ok. Reason: " + response.statusText);
    }

    const json = await response.json();

    const uniqueOptions = new Set<string>(json.data);

    return Array.from(uniqueOptions);
};

export default MultiSelect;
