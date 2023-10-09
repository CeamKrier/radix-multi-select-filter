import { useState, memo, useRef, useCallback } from "react";
import { Box, Button, Card, Checkbox, Flex, Heading, ScrollArea, Text, TextField } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import he from "he";
import Fuse from "fuse.js";
import { useSearchParams } from "react-router-dom";

type MultiSelectProps = {
    optionsRemoteAddress: string;
};

const fetchOptions = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
    }

    // our test case is not optimized
    // i should not need to perform this operation on front-end

    const json = await response.json();

    const uniqueOptions = new Set<string>(json.data);

    return Array.from(uniqueOptions);
};

const richTextRenderer = (text: string) => {
    const decodedText = he.decode(text);

    return decodedText;
};

const MultiSelectContainer = ({ children, loading }: { children: React.ReactNode; loading: boolean }) => {
    return (
        <Card className='bg-[#F8F8F8] p-8'>
            <Heading size='4' trim='start'>
                Categories
            </Heading>
            <br />
            {loading ? (
                <div className='absolute left-0 z-10 bg-blend-darken h-full min-w-full bg-slate-100 opacity-50 select-none'>
                    <div className='flex h-full items-center justify-center animate-spin'>/</div>
                </div>
            ) : null}
            {children}
        </Card>
    );
};

const SelectOption = memo(({ defaultChecked, hidden, label, key, onCheckedChange }: { onCheckedChange: (_value: string, _checked: boolean) => void; defaultChecked?: boolean; hidden?: boolean; label: string; key: string }) => {
    const handleCheckboxChange = (checked: boolean) => {
        onCheckedChange(label, checked);
    };

    return (
        <Box className={hidden ? `hidden` : ""} key={key} p='2' pr='8'>
            <Text as='label' size='2'>
                <Flex gap='2'>
                    <Checkbox defaultChecked={defaultChecked} onCheckedChange={handleCheckboxChange} />
                    {richTextRenderer(label)}
                </Flex>
            </Text>
        </Box>
    );
});

const MultiSelect = ({ optionsRemoteAddress }: MultiSelectProps) => {
    const {
        isLoading,
        isError,
        data: options,
        refetch
    } = useQuery({
        queryKey: ["options"],
        queryFn: () => fetchOptions(optionsRemoteAddress)
    });

    const [searchParams, setSearchParams] = useSearchParams();

    const initialOptionsSet = new Set(searchParams.getAll("option"));
    const selectedOptionsRef = useRef<Set<string>>(initialOptionsSet);
    const [filterText, setFilterText] = useState("");

    const fuse = new Fuse(options || [], {
        threshold: 0.3
    });

    const results = filterText ? fuse.search(filterText).map(({ item }) => item) : options;

    const handleSearch = () => {
        const params = Array.from(selectedOptionsRef.current)
            .map(option => `option=${encodeURIComponent(option)}`)
            .join("&");

        setSearchParams(`?${params}`);

        console.log("searching", selectedOptionsRef.current);
    };

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
                <div className='h-[360px] w-full'>
                    An error occured.
                    <Button onClick={() => refetch}>Retry</Button>
                </div>
            ) : (
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
            )}
        </MultiSelectContainer>
    );
};

export default MultiSelect;
