import { lazy, type JSX } from 'react';
import { type RouteObject } from 'react-router-dom';
import Navigator from './Providers/Navigator';

import DashboardLayout from './Layout/Layout';
import NotFoundPage from './pages/NotFounds/NotFoundPage';
import ModuleNotFound from './pages/NotFounds/NotFoundModule';

import AnimateWrapper from './components/AnimateWrapper';

const LoginPage = lazy(() => import('./pages/Login/Login'));
const HomePage = lazy(() => import('./pages/Home'));
const Subject = lazy(() => import('./pages/Subjects/Subject'));
const Teachers = lazy(() => import('./pages/Teachers/Teachers'));
const Classes = lazy(() => import('./pages/Classes/Classes'));
const Questions = lazy(() => import('./pages/Questions/Questions'));
const QuestionsDetail = lazy(() => import('./pages/Questions/QuestionDetail'));
const ClassDetail = lazy(() => import('./pages/Classes/ClassDetail'));
const Resource = lazy(() => import('./pages/Resources/Resource'));
const ResourceSubjectid = lazy(() => import('./pages/Resources/ResourceClass'));
const ResourceSubjectidDetail = lazy(
  () => import('./pages/Resources/ResourceClassDetail')
);

const withSuspense = (
  Component: React.LazyExoticComponent<() => JSX.Element>
) => {
  return (
    <AnimateWrapper>
      <Component />
    </AnimateWrapper>
  );
};
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigator />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          {
            path: 'home',
            element: withSuspense(HomePage)
          },
          {
            path: 'science',
            element: withSuspense(Subject)
          },
          {
            path: 'teachers',
            element: withSuspense(Teachers)
          },
          {
            path: 'classes',
            element: withSuspense(Classes)
          },
          {
            path: 'classes/:id',
            element: withSuspense(ClassDetail)
          },
          {
            path: 'resources',
            element: withSuspense(Resource)
          },
          {
            path: 'resources/:subjectId',
            element: withSuspense(ResourceSubjectid)
          },
          {
            path: 'resources/:subjectId/:classId',
            element: withSuspense(ResourceSubjectidDetail)
          },
          {
            path: 'questions',
            element: withSuspense(Questions)
          },
          {
            path: 'questions/:id',
            element: withSuspense(QuestionsDetail)
          },
          {
            path: '*',
            element: <ModuleNotFound />
          }
        ]
      }
    ]
  },
  {
    path: 'login',
    element: withSuspense(LoginPage)
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
];
