import {
  Refine,
  GitHubBanner,
  WelcomePage,
  Authenticated,
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { BrowserRouter, Route, Routes, Outlet } from "react-router";
import routerProvider, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { dataProvider } from "./providers/data";
import { Layout } from "./components/refine-ui/layout/layout";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import { BookOpen, GraduationCap, Home } from "lucide-react";
import SubjectsList from "./pages/subjects/List";
import SubjectsCreate from "./pages/subjects/Create";
import ClassesList from "./pages/classes/list";
import ClassesCreate from "./pages/classes/create";
import ClassesShow from "./pages/classes/show"

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "Pi909j-Ik8l8H-n8dVAg",
              }}
              resources={[
                {
                  name:'dashboard',
                  list:'/',
                  meta:{label:'Home',icon:<Home />}
                },
                {
                  name:'subjects',
                  list:'/subjects',
                  create:'/subjects/create',
                  meta:{label:'Subjects',icon:<BookOpen />}
                },
                {
                  name:'classes',
                  list:'/classes',
                  create:'/classes/create',
                  show:'/classes/show/:id',
                  meta:{label:'Classes',icon:<GraduationCap />}
                }
              ]}
            >
              <Routes>
                <Route element={
                  <Layout>
                    <Outlet />
                  </Layout>
                }>
                <Route path="/" element={<Dashboard />} />

                <Route path="subjects">
                  <Route index element={<SubjectsList />} />
                  <Route path="create" element={<SubjectsCreate />} />
                </Route>

                <Route path="classes">
                  <Route index element= {<ClassesList />} />
                  <Route path="create" element= {<ClassesCreate />} />
                  <Route path="show/:id" element= {<ClassesShow />} />
                </Route>

                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
