import { useEffect, useState } from 'react';
import { AppShell, Container, Title } from '@mantine/core';
import { PersonScheduleView } from './components/PersonScheduleView';
import { useScheduler } from './hooks/useScheduler';
import type { ScheduleState } from './types';
import { MantineProvider } from '@mantine/core';

// Import JSON data
import people from './data/people.json';
import leaves from './data/adeies.json';
import locations from './data/loc.json';
import fylakia from './data/fylakia.json';
import dailyTasks from './data/main_yp.json';

export default function App() {
  const [scheduleState] = useState<ScheduleState>({
    people,
    leaves,
    locations,
    fylakia,
    dailyTasks,
    assignments: {}
  });

  const { calculateMonthAssignments } = useScheduler(scheduleState);
  const [assignments, setAssignments] = useState({});

  useEffect(() => {
    // Calculate September 2025 assignments
    const septemberAssignments = calculateMonthAssignments(2025, 8);
    setAssignments(septemberAssignments);
  }, [calculateMonthAssignments]);

  return (
    <MantineProvider
      theme={{
        primaryColor: 'blue',
        white: '#ffffff',
        colors: {
          gray: ['#f8f9fa', '#f1f3f5', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd', '#868e96', '#495057', '#343a40', '#212529'],
          blue: ['#e7f5ff', '#d0ebff', '#a5d8ff', '#74c0fc', '#4dabf7', '#339af0', '#228be6', '#1c7ed6', '#1971c2', '#1864ab'],
        },
        components: {
          AppShell: {
            styles: {
              root: { backgroundColor: '#f8f9fa' },
              main: { backgroundColor: '#f8f9fa' }
            }
          },
          Paper: {
            styles: {
              root: { backgroundColor: 'white' }
            }
          },
          Text: {
            styles: {
              root: { color: '#495057' }
            }
          },
          Title: {
            styles: {
              root: { color: '#343a40' }
            }
          }
        }
      }}
    >
      <AppShell
        header={{ height: 60 }}
        padding="md"
      >
        <AppShell.Header style={{ backgroundColor: 'white', borderBottom: '1px solid #dee2e6' }}>
          <Container size="xl" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <Title order={1} size="h3">Army Task Management</Title>
          </Container>
        </AppShell.Header>

        <AppShell.Main>
          <Container size="xl">
            <PersonScheduleView
              assignments={assignments} 
              people={scheduleState.people} 
              leaves={scheduleState.leaves}
            />
          </Container>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
