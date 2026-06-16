createCoursesTable().then(() => {
  createUsersTable().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
});