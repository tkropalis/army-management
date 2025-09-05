export interface Person {
  id: number;
  gun: boolean;
  skip: boolean;
	name: string;
  'outside-skip'?: boolean;
  edu?: boolean;
}

export interface Leave {
  id: number;
  person: number;
  from: string;
  to: string;
}

export interface Location {
  id: number;
  name: string;
}

export interface Fylakio {
  id: number;
  people: number;
  loc: number;
  from: string;
  to: string;
}

export interface DailyTask {
  id: number;
  type: string;
  people: number;
  requires_gun: boolean;
}

export interface Assignment {
  location?: string;
  taskType?: string;
  person: number;
}

export interface DaySchedule {
  date: string;
  fylakiaAssignments: Assignment[];
  dailyTasks: Assignment[];
}

export interface ScheduleState {
  assignments: Record<string, DaySchedule>;
  people: Person[];
  leaves: Leave[];
  locations: Location[];
  fylakia: Fylakio[];
  dailyTasks: DailyTask[];
}
