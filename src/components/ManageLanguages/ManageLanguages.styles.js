export default {
  container: {
    position: 'relative',
    display: 'table',
    width: '100%',
    paddingRight: 20,
    marginBottom: 5,
  },
  languageSectionHeader: {
    fontSize: 16,
    margin: '0 0 10px 0',
  },
  removeLanguage: {
    position: 'absolute',
    top: 5,
    right: 0,
  },
  textInput: {
    verticalAlign: 'middle',
    display: 'table-cell',
    width: '100%',
  },
  proficiencySelect: {
    verticalAlign: 'middle',
    display: 'table-cell',
    width: '100%',
  },
  select: {
    marginLeft: -4, // Sort of hacky way to hide border-radius of Typeahead component
    borderRadius: '0 3px 3px 0',
    height: 34,
  },
  addLanguage: {
    fontSize: 12,
    textAlign: 'left',
  },
}
