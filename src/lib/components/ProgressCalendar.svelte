<!-- src/lib/components/ProgressCalendar.svelte -->
<script lang="ts">
  export let completionDates: string[] = [];

  // Get current month info
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Get first day of month and total days
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Generate array of days
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Check if a date is completed
  function isCompleted(day: number): boolean {
    const dateStr = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
    return completionDates.includes(dateStr);
  }

  // Month names
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
</script>

<div class="calendar">
  <h2>{monthNames[currentMonth]} {currentYear}</h2>

  <div class="calendar-grid">
    <!-- Day headers -->
    <div class="day-header">Sun</div>
    <div class="day-header">Mon</div>
    <div class="day-header">Tue</div>
    <div class="day-header">Wed</div>
    <div class="day-header">Thu</div>
    <div class="day-header">Fri</div>
    <div class="day-header">Sat</div>

    <!-- Empty cells for days before month starts -->
    {#each Array(firstDay) as _}
      <div class="day empty"></div>
    {/each}

    <!-- Actual days -->
    {#each days as day}
      <div class="day" class:completed={isCompleted(day)}>
        {day}
      </div>
    {/each}
  </div>
</div>

<style>
  .calendar {
    margin: 2rem 0;
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.5rem;
    max-width: 500px;
  }

  .day-header {
    font-weight: bold;
    text-align: center;
    padding: 0.5rem;
  }

  .day {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .day.empty {
    border: none;
  }

  .day.completed {
    background-color: #4ade80;
    color: white;
    font-weight: bold;
  }
</style>
