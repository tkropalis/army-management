import { useCallback, useState } from 'react';
import type { DaySchedule, ScheduleState } from '../types';
import { isDateBetween, parseDate } from '../utils/dateUtils';

interface PersonAssignmentInfo {
  lastFylakioDay: Date | null;
  consecutiveFylakioDays: number;
  lastDailyTask: { type: string, date: Date } | null;
  dailyTaskCount: Map<string, number>;
  totalAssignments: number;
  consecutiveWorkDays: number;
  lastWorkDay: Date | null;
}
export const calculateMonthAssignmentsForState = (stateParam: ScheduleState, year: number, month: number) => {
  const assignments: Record<string, DaySchedule> = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Helper to determine available people based on a provided state
  const getAvailablePeopleLocal = (
    date: Date,
    requiresGun = false,
    ignoreOutsideSkip = false
  ) => {
    return stateParam.people.filter(person => {
      if (person.skip) return false;
      if (requiresGun && !person.gun) return false;
      if (!ignoreOutsideSkip && person['outside-skip']) return false;
      if (person.edu && date < new Date(2025, 8, 5)) return false;
      const isOnLeave = stateParam.leaves.some(leave => {
        if (leave.person !== person.id) return false;
        return isDateBetween(date, parseDate(leave.from), parseDate(leave.to));
      });
      return !isOnLeave;
    });
  };

  const getAvailablePeopleForFylakiaLocal = (date: Date) => getAvailablePeopleLocal(date, true, false);

  // Track assignments for consecutive days and fairness
  const personAssignments = new Map<number, PersonAssignmentInfo>();
  stateParam.people.forEach(p => {
    personAssignments.set(p.id, {
      lastFylakioDay: null,
      consecutiveFylakioDays: 0,
      lastDailyTask: null,
      dailyTaskCount: new Map(),
      totalAssignments: 0,
      consecutiveWorkDays: 0,
      lastWorkDay: null
    });
  });

  // First pass: Assign fylakia
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    
    assignments[dateStr] = {
      date: dateStr,
      fylakiaAssignments: [],
      dailyTasks: []
    };

    const dailyAssignments = new Set<number>();

    // Handle fylakia assignments
    const dayFylakia = stateParam.fylakia.filter(f => 
      isDateBetween(date, parseDate(f.from), parseDate(f.to))
    );

    let availablePeople = getAvailablePeopleForFylakiaLocal(date);

    dayFylakia.forEach(fylakio => {
      const location = stateParam.locations.find(l => l.id === fylakio.loc);
      if (!location) return;

      const unassignedPeople = availablePeople.filter(p => 
        !dailyAssignments.has(p.id)
      );

      if (unassignedPeople.length > 0) {
        // Get best candidate based on consecutive days and total assignments
        const bestCandidate = unassignedPeople.sort((a, b) => {
          const aAssign = personAssignments.get(a.id)!;
          const bAssign = personAssignments.get(b.id)!;

          // Don't exceed 4 consecutive days
          if (aAssign.consecutiveFylakioDays >= 4) return 1;
          if (bAssign.consecutiveFylakioDays >= 4) return -1;

          // Prefer continuing assignments if under 4 days
          if (aAssign.lastFylakioDay && 
              date.getTime() - aAssign.lastFylakioDay.getTime() === 24 * 60 * 60 * 1000 &&
              aAssign.consecutiveFylakioDays < 3) return -1;
          if (bAssign.lastFylakioDay &&
              date.getTime() - bAssign.lastFylakioDay.getTime() === 24 * 60 * 60 * 1000 &&
              bAssign.consecutiveFylakioDays < 3) return 1;

          // Otherwise prefer person with fewer total assignments
          return aAssign.totalAssignments - bAssign.totalAssignments;
        })[0];

        // Update assignment tracking
        const assignmentInfo = personAssignments.get(bestCandidate.id)!;
        if (assignmentInfo.lastFylakioDay &&
            date.getTime() - assignmentInfo.lastFylakioDay.getTime() === 24 * 60 * 60 * 1000) {
          assignmentInfo.consecutiveFylakioDays++;
        } else {
          assignmentInfo.consecutiveFylakioDays = 1;
        }
        assignmentInfo.lastFylakioDay = date;
        assignmentInfo.totalAssignments++;
        assignmentInfo.consecutiveWorkDays++;
        assignmentInfo.lastWorkDay = date;

        dailyAssignments.add(bestCandidate.id);
        assignments[dateStr].fylakiaAssignments.push({
          location: location.name,
          person: bestCandidate.id
        });
      }
    });
  }

  // Second pass: Handle daily tasks with new distribution rules
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    const dailyAssignments = new Set(
      assignments[dateStr].fylakiaAssignments.map(a => a.person)
    );

    stateParam.dailyTasks.forEach(task => {
      let availablePeople = getAvailablePeopleLocal(date, task.requires_gun, true)
        .filter(p => !dailyAssignments.has(p.id));

      // Filter out people who have fylakio assignments in the next two days
      availablePeople = availablePeople.filter(person => {
        for (let i = 1; i <= 2; i++) {
          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + i);
          const nextDateStr = nextDate.toISOString().split('T')[0];
          if (assignments[nextDateStr]?.fylakiaAssignments.some(a => a.person === person.id)) {
            return false;
          }
        }
        return true;
      });

      if (availablePeople.length > 0) {
        // Get best candidate based on work/free day pattern and task history
        const bestCandidate = availablePeople.sort((a, b) => {
          const aAssign = personAssignments.get(a.id)!;
          const bAssign = personAssignments.get(b.id)!;

          // Check for 1+1 pattern first
          const aLastWorkDayDiff = aAssign.lastWorkDay ? 
            Math.floor((date.getTime() - aAssign.lastWorkDay.getTime()) / (24 * 60 * 60 * 1000)) : 
            Infinity;
          const bLastWorkDayDiff = bAssign.lastWorkDay ? 
            Math.floor((date.getTime() - bAssign.lastWorkDay.getTime()) / (24 * 60 * 60 * 1000)) : 
            Infinity;

          // Prefer 1 day work + 1 day free pattern
          if (aLastWorkDayDiff === 1 && bLastWorkDayDiff !== 1) return 1;
          if (bLastWorkDayDiff === 1 && aLastWorkDayDiff !== 1) return -1;

          // Then try 2 days work + 1 day free pattern
          if (aLastWorkDayDiff === 2 && aAssign.consecutiveWorkDays >= 2) return 1;
          if (bLastWorkDayDiff === 2 && bAssign.consecutiveWorkDays >= 2) return -1;

          // Then consider task history
          const aCount = aAssign.dailyTaskCount.get(task.type) || 0;
          const bCount = bAssign.dailyTaskCount.get(task.type) || 0;
          if (aCount !== bCount) return aCount - bCount;

          // Finally consider total assignments
          return aAssign.totalAssignments - bAssign.totalAssignments;
        })[0];

        // Update assignment tracking
        const assignmentInfo = personAssignments.get(bestCandidate.id)!;
        assignmentInfo.lastDailyTask = { type: task.type, date };
        assignmentInfo.dailyTaskCount.set(
          task.type,
          (assignmentInfo.dailyTaskCount.get(task.type) || 0) + 1
        );
        assignmentInfo.totalAssignments++;
        
        // Update work day tracking
        const lastWorkDayDiff = assignmentInfo.lastWorkDay ? 
          Math.floor((date.getTime() - assignmentInfo.lastWorkDay.getTime()) / (24 * 60 * 60 * 1000)) :
          Infinity;
        
        if (lastWorkDayDiff === 1) {
          assignmentInfo.consecutiveWorkDays++;
        } else {
          assignmentInfo.consecutiveWorkDays = 1;
        }
        assignmentInfo.lastWorkDay = date;

        dailyAssignments.add(bestCandidate.id);
        assignments[dateStr].dailyTasks.push({
          taskType: task.type,
          person: bestCandidate.id
        });
      }
    });
  }

  return assignments;
};

export const useScheduler = (initialState: ScheduleState) => {
  const [state, setState] = useState(initialState);

  const calculateMonthAssignments = useCallback((year: number, month: number) => {
    return calculateMonthAssignmentsForState(state, year, month);
  }, [state]);

  return {
    state,
    setState,
    calculateMonthAssignments
  };
};
