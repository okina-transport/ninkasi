import _ from 'underscore';

export const sortUsersby = (users, sortOrder) => {
  if (!sortOrder || sortOrder.column === null) return users;

  const { column, asc } = sortOrder;

  const keySorter = {
    username: (a, b, asc) =>
      asc ? sortAsc(a.username, b.username) : sortDesc(a.username, b.username),
    firstName: (a, b, asc) =>
      asc
        ? sortAsc(a.contactDetails.firstName, b.contactDetails.firstName)
        : sortDesc(a.contactDetails.firstName, b.contactDetails.firstName),
    lastName: (a, b, asc) =>
      asc
        ? sortAsc(a.contactDetails.lastName, b.contactDetails.lastName)
        : sortDesc(a.contactDetails.lastName, b.contactDetails.lastName),
    email: (a, b, asc) =>
      asc
        ? sortAsc(a.contactDetails.email, b.contactDetails.email)
        : sortDesc(a.contactDetails.email, b.contactDetails.email),
    organisation: (a, b, asc) =>
      asc
        ? sortAsc(a.organisation.name, b.organisation.name)
        : sortDesc(a.organisation.name, b.organisation.name)
  };

  return users.slice(0).sort((a, b) => keySorter[column](a, b, asc));
};

export const sortByColumns = (items, sortOrder) => {
  if (!sortOrder || sortOrder.column === null) return items;
  const { column, asc } = sortOrder;
  return items
    .slice(0)
    .sort(
      (a, b) =>
        asc ? sortAsc(a[column], b[column]) : sortDesc(a[column], b[column])
    );
};

const sortAsc = (a, b) => {
  return a.localeCompare(b);
};

const sortDesc = (a, b) => {
  return b.localeCompare(a);
};

export const getEntityClassificationRefString = (entityType, allow) => {
  if (!allow) {
    const lastIndex = entityType.lastIndexOf(':');
    if (lastIndex > -1) {
      return (
        entityType.substr(0, lastIndex + 1) +
        '!' +
        entityType.substr(lastIndex + 1)
      );
    }
  }
  return entityType;
};

export const getSizeFromBytes = bytes => {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes == 0) return '0 Byte';

  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

export const getOrganizationNameByRef = (organizations, ref) => {
  if (!organizations) return ref;

  for (let i = 0; i < organizations.length; i++) {
    let org = organizations[i];
    if (org.id === ref) return org.name;
  }
  return ref;
};

export const getAdminZoneNameByRef = (adminZones, ref) => {
  if (!adminZones) return ref;

  for (let i = 0; i < adminZones.length; i++) {
    let zone = adminZones[i];
    if (zone.id === ref) return zone.name;
  }
  return ref;
};

export const sortFiles = (unsortedFiles, sortOrder, filterText) => {
  let files = unsortedFiles.slice().filter(file => {
    if (!file.name) return;

    if (file.name.toLowerCase().indexOf(filterText.toLowerCase()) > -1)
      return file;
  });

  let sortedFiles = !sortOrder.ext
    ? _.sortBy(files, file => new Date(file.updated))
    : sortOrder.ext == 1
      ? _.sortBy(files, file => file.ext)
      : _.sortBy(files, file => file.ext).reverse();

  sortedFiles = !sortOrder.name
    ? sortedFiles
    : sortOrder.name == 1
      ? _.sortBy(files, file => file.name)
      : _.sortBy(files, file => file.name).reverse();

  sortedFiles = !sortOrder.size
    ? sortedFiles
    : sortOrder.size == 1
      ? _.sortBy(files, file => file.fileSize)
      : _.sortBy(files, file => file.fileSize).reverse();

  sortedFiles = !sortOrder.date
    ? sortedFiles
    : sortOrder.date == 1
      ? _.sortBy(files, file => new Date(file.updated))
      : _.sortBy(files, file => new Date(file.updated)).reverse();

  return sortedFiles;
};
