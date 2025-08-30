const MainCalc = () => {
  // Load data from JSON files
  const people = require('./people.json');
  const adeies = require('./adeies.json');
  const fylakia = require('./fylakia.json');
  const locations = require('./loc.json');
  const mainYp = require('./main_yp.json');

  // Track assignments across days
  const personAssignments = new Map(); // Track each person's assignments
  const taskHistory = new Map(); // Track who did each task recently
  const fylakiaHistory = new Map(); // Track fylakia assignments

  // Initialize tracking for each person
  people.forEach(person => {
    personAssignments.set(person.id, {
      lastFylakioDay: null,
      consecutiveFylakioDays: 0,
      lastDailyTask: null,
      dailyTaskCount: new Map(), // Track how many times each task was assigned
      totalAssignments: 0
    });
  });

  // Helper function to track fylakia assignments
  const trackFylakioAssignment = (personId, date) => {
    const person = personAssignments.get(personId);
    if (person.lastFylakioDay) {
      const dayDiff = Math.floor((date - person.lastFylakioDay) / (1000 * 60 * 60 * 24));
      if (dayDiff === 1) {
        person.consecutiveFylakioDays++;
      } else {
        person.consecutiveFylakioDays = 1;
      }
    } else {
      person.consecutiveFylakioDays = 1;
    }
    person.lastFylakioDay = date;
    person.totalAssignments++;
  };

  // Helper function to track daily task assignments
  const trackDailyTask = (personId, taskType, date) => {
    const person = personAssignments.get(personId);
    person.lastDailyTask = { type: taskType, date };
    person.dailyTaskCount.set(taskType, (person.dailyTaskCount.get(taskType) || 0) + 1);
    person.totalAssignments++;

    // Update task history
    if (!taskHistory.has(taskType)) {
      taskHistory.set(taskType, []);
    }
    taskHistory.get(taskType).push({ personId, date });
  };

  // Helper function to get the best candidate for a task
  const getBestCandidate = (availablePeople, taskType, date, isFylakio = false) => {
    return availablePeople.sort((a, b) => {
      const aAssign = personAssignments.get(a.id);
      const bAssign = personAssignments.get(b.id);

      if (isFylakio) {
        // For fylakia, prioritize people who haven't done it recently
        // and haven't exceeded the 3-4 day limit
        if (aAssign.consecutiveFylakioDays >= 4) return 1;
        if (bAssign.consecutiveFylakioDays >= 4) return -1;
        if (aAssign.consecutiveFylakioDays === 3 && bAssign.consecutiveFylakioDays < 3) return 1;
        if (bAssign.consecutiveFylakioDays === 3 && aAssign.consecutiveFylakioDays < 3) return -1;
      } else {
        // For daily tasks, prioritize people who haven't done this specific task recently
        const aCount = aAssign.dailyTaskCount.get(taskType) || 0;
        const bCount = bAssign.dailyTaskCount.get(taskType) || 0;
        if (aCount !== bCount) return aCount - bCount;
      }

      // If all else is equal, prioritize people with fewer total assignments
      return aAssign.totalAssignments - bAssign.totalAssignments;
    })[0];
  };

  // Helper function to check if a date is between two dates
  const isDateBetween = (date, start, end) => {
    const checkDate = new Date(date);
    const startDate = new Date(start);
    const endDate = new Date(end);
    return checkDate >= startDate && checkDate <= endDate;
  };

  // Convert date string (DD/MM) to 2025 date object
  const parseDate = (dateStr) => {
    const [day, month] = dateStr.split('/');
    return new Date(2025, parseInt(month) - 1, parseInt(day));
  };

  // Get available people for a specific date and requirements
  const getAvailablePeople = (date, requiresGun = false, ignoreOutsideSkip = false) => {
    const dateObj = new Date(date);
    
    return people.filter(person => {
      // Check if person is skipped
      if (person.skip) return false;
      
      // Check gun requirement
      if (requiresGun && !person.gun) return false;
      
      // Check outside-skip unless ignored
      if (!ignoreOutsideSkip && person['outside-skip']) return false;
      
      // Check if person has edu=true and date is before 5/9
      if (person.edu && dateObj < new Date(2025, 8, 5)) return false;

      // Check if person is on leave
      const isOnLeave = adeies.some(adeia => {
        if (adeia.person !== person.id) return false;
        return isDateBetween(dateObj, parseDate(adeia.from), parseDate(adeia.to));
      });

      return !isOnLeave;
    });
  };

  // Get available people for fylakia specifically
  const getAvailablePeopleForFylakia = (date) => {
    return getAvailablePeople(date, true, false);
  };

  // Calculate assignments for September
  // Format the assignments into a more readable structure
  const formatAssignments = (rawAssignments) => {
    const formatted = [];
    
    Object.entries(rawAssignments)
      .filter(([dateStr]) => dateStr.startsWith('2025-09-')) // Only include September dates
      .forEach(([dateStr, dayData]) => {
        const date = new Date(dateStr);
        const dayStr = date.toLocaleDateString('en-US', { 
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        });

      const formattedDay = {
        date: dayStr,
        fylakia: dayData.fylakiaAssignments.map(f => ({
          location: f.location,
          person: f.assignedPerson
        })),
        tasks: dayData.dailyTasks.map(t => ({
          type: t.type,
          person: t.assignedPeople[0]
        }))
      };

      formatted.push(formattedDay);
    });

    return formatted;
  };

  const calculateSeptemberAssignments = () => {
    const assignments = {};
    // Generate dates only for September
    const september = [...Array(30)].map((_, i) => {
      const date = new Date(2025, 8, i + 1); // Month is 0-based, so 8 is September
      return date;
    }).filter(date => date.getMonth() === 8 && date.getDate() >= 1); // Only include September 1-30
    
    // Track assigned people for each day to avoid double assignments
    const dailyAssignments = new Map();
    
    // For each day in September
    september.forEach(date => {
      const dateStr = date.toISOString().split('T')[0];
      dailyAssignments.set(dateStr, new Set()); // Track assigned people for this day

      assignments[dateStr] = {
        date: dateStr,
        fylakiaAssignments: [],
        dailyTasks: []
      };

      // First handle fylakia as they have stricter requirements
      const dayFylakia = fylakia.filter(f => 
        isDateBetween(date, parseDate(f.from), parseDate(f.to))
      );

      let availablePeople = getAvailablePeopleForFylakia(date);

      // For each fylakio requirement on this day
      dayFylakia.forEach(fylakio => {
        const location = locations.find(l => l.id === fylakio.loc);
        
        // Filter out already assigned people
        const unassignedPeople = availablePeople.filter(p => 
          !dailyAssignments.get(dateStr).has(p.id)
        );
        
        if (unassignedPeople.length > 0) {
          // Get the best candidate based on fylakia rules
          const assignedPerson = getBestCandidate(unassignedPeople, null, date, true);
          
          if (assignedPerson) {
            dailyAssignments.get(dateStr).add(assignedPerson.id);
            trackFylakioAssignment(assignedPerson.id, date);
            
            assignments[dateStr].fylakiaAssignments.push({
              location: location.name,
              peopleNeeded: fylakio.people,
              assignedPerson: assignedPerson.id
            });
          }
        }
      });

      // Then handle daily tasks
      mainYp.forEach(task => {
        // Get available people for this task based on gun requirement
        availablePeople = getAvailablePeople(date, task.requires_gun, true)
          .filter(p => !dailyAssignments.get(dateStr).has(p.id)); // Filter out already assigned people

        if (availablePeople.length > 0) {
          // Get best candidate for this task based on task history
          const assignedPerson = getBestCandidate(availablePeople, task.type, date, false);
          
          if (assignedPerson) {
            dailyAssignments.get(dateStr).add(assignedPerson.id);
            trackDailyTask(assignedPerson.id, task.type, date);

            assignments[dateStr].dailyTasks.push({
              type: task.type,
              peopleNeeded: task.people,
              assignedPeople: [assignedPerson.id]
            });
          }
        }
      });

      // Validate assignments
      const assignedPeopleCount = dailyAssignments.get(dateStr).size;
      const availablePeopleCount = getAvailablePeople(date, false, true).length;
      
      if (assignedPeopleCount > availablePeopleCount * 0.8) {
        console.warn(`Warning: High workload on ${dateStr}. ${assignedPeopleCount} out of ${availablePeopleCount} people assigned.`);
      }
    });

    return assignments;
  };

  return formatAssignments(calculateSeptemberAssignments());
}

module.exports = MainCalc;