import { RouterProvider } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import router from "./routes/route";
import { REACT_QUERY_PERSIST_KEY } from "@/constants/key";

const queryClient = new QueryClient();
const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: REACT_QUERY_PERSIST_KEY,
});

function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <RouterProvider router={router} />
    </PersistQueryClientProvider>
  );
}

export default App;
