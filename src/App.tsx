import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MultiSelect from "./components/MultiSelect";

const OPTIONS_REMOTE_ADDR = "/data.json";

const router = createBrowserRouter(
    [
        {
            path: "/",
            Component() {
                return (
                    <section className='flex min-h-screen min-w-screen'>
                        <div className='flex flex-1 flex-col items-center justify-center'>
                            <h1 className='text-3xl font-bold underline'>Multi-select Filter</h1>
                            <div className='my-6' />

                            <MultiSelect optionsRemoteAddress={OPTIONS_REMOTE_ADDR} />
                        </div>
                    </section>
                );
            }
        }
    ],
    {
        basename: "/radix-multi-select-filter"
    }
);

function App() {
    return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
}

if (import.meta.hot) {
    import.meta.hot.dispose(() => router.dispose());
}

export default App;
