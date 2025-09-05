import { Badge, Paper, Table, Text, Title } from '@mantine/core';
import type { DaySchedule, Person, Leave } from '../types';
import { isDateBetween, parseDate } from '../utils/dateUtils';

interface PersonScheduleViewProps {
  assignments: Record<string, DaySchedule>;
  people: Person[];
  leaves: Leave[];
}


export const PersonScheduleView = ({ assignments, people, leaves }: PersonScheduleViewProps) => {
  // Get all dates from September onwards and sort them
  const dates = Object.keys(assignments)
    .filter(date => new Date(date) >= new Date(2025, 8, 1)) // 8 is September (0-based)
    .sort();
  
  // Create a map of person schedules
  const personSchedules = people.map(person => {
    const schedule = dates.map(date => {
      const daySchedule = assignments[date];
      const currentDate = new Date(date);

      // Check if person is on leave
      const isOnLeave = leaves.some((leave: Leave) => {
        if (leave.person !== person.id) return false;
        return isDateBetween(currentDate, parseDate(leave.from), parseDate(leave.to));
      });
      
      if (isOnLeave) {
        return {
          type: 'adeia',
          date
        };
      }
      
      // Check fylakia assignments
      const fylakioAssignment = daySchedule.fylakiaAssignments.find(
        a => a.person === person.id
      );
      if (fylakioAssignment) {
        return {
          type: 'fylakio',
          location: fylakioAssignment.location,
          date
        };
      }

      // Check daily tasks
      const taskAssignment = daySchedule.dailyTasks.find(
        t => t.person === person.id
      );
      if (taskAssignment) {
        return {
          type: taskAssignment.taskType === 'K' ? 'kitchen' : 'task',
          taskType: taskAssignment.taskType,
          date
        };
      }

      // If no assignment, the person is free
      return {
        type: 'free',
        date
      };
    });

    // Calculate metrics for the person's schedule
    const metrics = schedule.reduce((acc, day, index, array) => {
      if (index === 0) return acc;

      const prevDay = array[index - 1];
      const nextDay = array[index + 1];
      
      if (day.type === 'free' && (prevDay.type === 'fylakio' || nextDay?.type === 'fylakio')) {
        acc.freeDaysAroundFylakio++;
      }

      if (day.type === 'fylakio') {
        let consecutiveDays = 1;
        let i = index - 1;
        // Count backwards
        while (i >= 0 && array[i].type === 'fylakio') {
          consecutiveDays++;
          i--;
        }
        // Count forwards
        i = index + 1;
        while (i < array.length && array[i].type === 'fylakio') {
          consecutiveDays++;
          i++;
        }
        acc.maxConsecutiveFylakioDays = Math.max(acc.maxConsecutiveFylakioDays, consecutiveDays);

        if (prevDay.type === 'fylakio') {
          acc.consecutiveFylakioDays++;
        }
      }

      if (day.type !== 'free') {
        if (prevDay.type !== 'free') {
          acc.consecutiveWorkDays++;
        }
        acc.totalWorkDays++;
      }

      return acc;
    }, {
      freeDaysAroundFylakio: 0,
      consecutiveFylakioDays: 0,
      maxConsecutiveFylakioDays: 0,
      consecutiveWorkDays: 0,
      totalWorkDays: schedule.filter(d => d.type !== 'free').length
    });

    return {
      person,
      schedule,
      metrics
    };
  });

  return (
    <Paper p="md" style={{ overflowX: 'auto' }}>
      <Title order={2} mb="md">Person Schedules</Title>
      
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: '150px' }}>Person</Table.Th>
            {dates.map(date => {
              const d = new Date(date);
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              return (
                <Table.Th 
                  key={date} 
                  style={{ 
                    width: '40px',
                    backgroundColor: isWeekend ? '#f8f9fa' : undefined,
                    textAlign: 'center',
                    padding: '4px'
                  }}
                >
                  <Text size="xs" fw={500}>{d.getDate()}</Text>
                  <Text size="xs" c="dimmed">
                    {d.toLocaleDateString('en-US', { weekday: 'short' })}
                  </Text>
                </Table.Th>
              );
            })}
            <Table.Th style={{ width: '100px' }}>Stats</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {personSchedules.map(({ person, schedule, metrics }) => (
            <Table.Tr key={person.id}>
              <Table.Td style={{ padding: '4px' }}>
                <Text size="sm" fw={500}>
                  {person.name}
									{[
                    person.skip ? '⏸️' : ''
                  ].filter(Boolean).join(' ')}
                </Text>
              </Table.Td>
              {schedule.map((day, index) => {
                const date = new Date(day.date);
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                return (
                  <Table.Td 
                    key={index} 
                    style={{
                      padding: '4px',
                      textAlign: 'center',
                      backgroundColor: day.type === 'free' ? (isWeekend ? '#e7f5ff' : '#d0ebff') :
                                     day.type === 'fylakio' ? '#fff3bf' :
                                     day.type === 'kitchen' ? '#ebfbee' :
                                     day.type === 'adeia' ? '#ffe8cc' :
                                     day.type === 'task' ? '#e9ecef' : 'white'
                    }}
                  >
                    {day.type === 'fylakio' && (
                      <Text size="xs" fw={500} style={{ wordBreak: 'break-word' }}>
                        {day.location}
                      </Text>
                    )}
                    {(day.type === 'task' || day.type === 'kitchen') && (
                      <Text size="xs" style={{ wordBreak: 'break-word' }}>
                        {day.taskType}
                      </Text>
                    )}
                  </Table.Td>
                );
              })}
              <Table.Td style={{ padding: '4px' }}>
                <Badge 
                  size="sm"
                  color={metrics.maxConsecutiveFylakioDays > 3 ? "red" : "green"}
                >
                  F:{metrics.maxConsecutiveFylakioDays}d
                </Badge>{' '}
                <Badge 
                  size="sm"
                  color={metrics.freeDaysAroundFylakio < metrics.consecutiveFylakioDays ? "red" : "green"}
                >
                  R:{metrics.freeDaysAroundFylakio}
                </Badge>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
};
