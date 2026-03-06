export function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) {
    return `Good morning! 🌅`;
    /*${newName}!*/
  } else if (hour < 18) {
    return `Good afternoon!☀️`;
    /*${newName}!*/
  } else {
    return `Good evening!🌕`;
    /*${newName}!*/
  }
}
