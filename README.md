# MultiSelect Component

The MultiSelect Component is designed to provide a user-friendly interface for selecting multiple options from a list. It fetches data from a specified remote address, and allows for real-time searching and selection of options. This documentation outlines the key features of the component, the libraries and hooks used, and the rationale behind the design choices made.

## Table of Contents

1. [Key Features](#key-features)
2. [Libraries and Hooks Used](#libraries-and-hooks-used)
3. [Usage](#usage)
4. [Component Structure](#component-structure)
5. [Error Handling and Retry Mechanism](#error-handling-and-retry-mechanism)
6. [Example Data for Testing](#example-data-for-testing)

## Key Features

- **Remote Data Fetching**: 
    - Fetches options from a remote server to ensure data is always up-to-date.
- **Error Handling**:
    - Graceful error handling with a retry mechanism for failed data fetches.
- **Real-Time Search**:
    - Utilizes Fuse.js for real-time search functionality, allowing users to easily filter through the available options.
- **Refetching on Demand**:
    - Provides a "Retry" button to trigger a refetch in case of an error.
    
## Libraries and Hooks Used

- **React**:
    - Utilizes state and effect hooks for managing component state and side effects.
- **React Query**:
    - Used for data fetching, caching, and state management. 
    - Handles data fetching and provides hooks for managing query state.
    - Provides a `useQuery` hook to manage fetching, caching, and the state of the fetched data.
- **React Router Dom**:
    - The `useSearchParams` hook is used to manage query parameters in the URL.
- **Radix UI**:
    - Provides accessible UI primitives for building the user interface.
- **Fuse.js**:
    - Lightweight fuzzy-search library, which is utilized for real-time search functionality.
  
## Usage

```javascript
import MultiSelect from './MultiSelect';

function App() {
    return (
        <MultiSelect optionsRemoteAddress="https://example.com/api/options" />
    );
}

export default App;
```

## Component Structure

The MultiSelect component is structured into several sub-components and utility functions to keep the code organized and maintainable:

- `MultiSelectContainer`: A container component for managing loading and error states.
- `MultiSelectOverlay`: An overlay component displayed when an error occurs.
- `SelectOption`: Represents an individual option in the list.
- `fetchOptions`: A utility function for fetching options from the remote server.
  
## Error Handling and Retry Mechanism

The component is designed to handle network errors gracefully. If a network error occurs while fetching data, an overlay is displayed with a "Retry" button. Users can click the "Retry" button to trigger a refetch of the data.

The retry mechanism is built using the `refetch` function provided by React Query, which is triggered by clicking the "Retry" button. The `retry` option in the `useQuery` hook is set to 2, meaning that React Query will automatically retry the fetch two times before moving to the error state.

```javascript
// Inside MultiSelect Component
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
```

## Example Data for Testing

For testing purposes, an example dataset is provided in the public folder, named `data.json`. This file contains a list of searchable keys under the "data" property as shown below:

```json
{
    "data": ["searchable keys",...]
}
```

This dataset is used to test the fetching, searching, and selection functionalities of the MultiSelect component in a controlled environment, ensuring that the component behaves as expected with the given data structure.