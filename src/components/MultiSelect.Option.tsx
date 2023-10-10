import { memo } from "react";
import { Box, Checkbox, Flex, Text } from "@radix-ui/themes";
import { richTextRenderer } from "../utils/renderers";

type SelectOptionProps = {
    onCheckedChange: (_value: string, _checked: boolean) => void;
    defaultChecked?: boolean;
    hidden?: boolean;
    label: string;
};

export const SelectOption = memo(({ defaultChecked, hidden, label, onCheckedChange }: SelectOptionProps) => {
    const handleCheckboxChange = (checked: boolean) => {
        onCheckedChange(label, checked);
    };

    return (
        <Box className={hidden ? `hidden` : ""} p='2' pr='8'>
            <Text as='label' size='2'>
                <Flex gap='2'>
                    <Checkbox defaultChecked={defaultChecked} onCheckedChange={handleCheckboxChange} />
                    {richTextRenderer(label)}
                </Flex>
            </Text>
        </Box>
    );
});
