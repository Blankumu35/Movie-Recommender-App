  useEffect(() => {
    setFilteredActors(
      actors.filter(actor =>
        actor.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, actors]);