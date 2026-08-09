const fs = require('fs');
const url = "https://pydvuqjhzcrpauzpssxg.supabase.co/rest/v1/job_character_assets?select=*";
const options = {
  headers: {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZHZ1cWpoemNycGF1enBzc3hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NjI5MTYsImV4cCI6MjEwMDUzODkxNn0.PCs3IJYmmo5y0b-d09ztRlbP7QjVb0HTur_jD-8NqYc",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZHZ1cWpoemNycGF1enBzc3hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NjI5MTYsImV4cCI6MjEwMDUzODkxNn0.PCs3IJYmmo5y0b-d09ztRlbP7QjVb0HTur_jD-8NqYc"
  }
};

fetch(url, options)
  .then(res => res.json())
  .then(data => {
    fs.writeFileSync('job_assets.json', JSON.stringify(data, null, 2));
    console.log(`Fetched ${data.length} items`);
  })
  .catch(err => console.error(err));
