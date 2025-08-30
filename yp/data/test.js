const MainCalc = require('./main.js');

const result = MainCalc();

// Helper function to pad strings for alignment
const pad = (str, len) => str.toString().padEnd(len);

// Print the schedule
console.log('\n=== September 2025 Daily Schedule ===\n');

result.forEach(day => {
  // Print date header
  console.log(`\n${day.date}`);
  console.log('='.repeat(day.date.length));
  
  // Print fylakia assignments
  console.log('\nFylakia Assignments:');
  if (day.fylakia.length === 0) {
    console.log('  No fylakia assignments');
  } else {
    day.fylakia.forEach(f => {
      console.log(`  ${pad(f.location, 10)} : Person ${f.person}`);
    });
  }
  
  // Print daily tasks
  console.log('\nDaily Tasks:');
  if (day.tasks.length === 0) {
    console.log('  No daily tasks');
  } else {
    day.tasks.forEach(t => {
      console.log(`  ${pad(t.type, 4)} : Person ${t.person}`);
    });
  }
  
  console.log('\n' + '-'.repeat(40));
});
