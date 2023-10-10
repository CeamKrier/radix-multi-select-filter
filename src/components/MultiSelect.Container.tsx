import { Card, Heading } from "@radix-ui/themes";
import MultiSelectOverlay from "./MultiSelect.Overlay";

type MultiSelectContainerProps = {
    loading: boolean;
    children: React.ReactNode;
};

export const MultiSelectContainer = ({ children, loading }: MultiSelectContainerProps) => {
    return (
        <Card className='bg-[#F8F8F8] p-8'>
            <Heading size='4' trim='start'>
                Categories
            </Heading>
            <br />
            {loading ? (
                <MultiSelectOverlay>
                    <div className='animate-spin'>/</div>
                </MultiSelectOverlay>
            ) : null}
            {children}
        </Card>
    );
};
