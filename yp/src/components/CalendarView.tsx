import { useState } from 'react';
import { Grid, Paper, Text, Title } from '@mantine/core';
import type { DaySchedule, Person } from '../types';

interface CalendarViewProps {
  assignments: Record<string, DaySchedule>;
  people: Person[];
}

export const CalendarView = ({ assignments, people }: CalendarViewProps) => {
  const getPersonName = (id: number) => {
    const person = people.find(p => p.id === id);
    return person?.name || `Person ${id}`;
  };
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const renderDay = (dateStr: string, schedule: DaySchedule) => {
    const date = new Date(dateStr);
    const isSelected = dateStr === selectedDate;

    return (
      <Paper
        key={dateStr}
        p="md"
        withBorder
        shadow={isSelected ? "sm" : "xs"}
        style={{
          cursor: 'pointer',
          backgroundColor: isSelected ? '#f8f9fa' : 'white',
          transition: 'all 0.2s ease'
        }}
        onClick={() => setSelectedDate(dateStr)}
      >
        <Title order={4}>
          {date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
          })}
        </Title>

        <Text size="sm" fw={600} mt="md" c="blue.8">Fylakia Assignments</Text>

        <div style={{ marginTop: '0.5rem', borderTop: '1px solid #e9ecef', paddingTop: '0.5rem' }}>
          {schedule.fylakiaAssignments.map((assignment, i) => (
            <Text key={i} size="sm" style={{ padding: '0.25rem 0' }}>
              <span style={{ color: '#495057', fontWeight: 500 }}>{assignment.location}:</span>{' '}
              <span style={{ color: '#228be6' }}>{getPersonName(assignment.person)}</span>
            </Text>
          ))}
        </div>

        <Text size="sm" fw={600} mt="lg" c="blue.8">Daily Tasks</Text>

        <div style={{ marginTop: '0.5rem', borderTop: '1px solid #e9ecef', paddingTop: '0.5rem' }}>
          {schedule.dailyTasks.map((task, i) => (
            <Text key={i} size="sm" style={{ padding: '0.25rem 0' }}>
              <span style={{ color: '#495057', fontWeight: 500 }}>{task.taskType}:</span>{' '}
              <span style={{ color: '#228be6' }}>{getPersonName(task.person)}</span>
            </Text>
          ))}
        </div>
      </Paper>
    );
  };

  return (
    <Grid>
      {Object.entries(assignments).map(([dateStr, schedule]) => (
        <Grid.Col key={dateStr} span={4}>
          {renderDay(dateStr, schedule)}
        </Grid.Col>
      ))}
    </Grid>
  );
};
