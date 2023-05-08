import directories from './structure.json';

function getImages(children, folderName) {
  return children.map((file) => ({
    file: file.name,
    path: `./images/projects/${folderName}/${file.name}`,
  }));
}

function parseProject(project, imagesList = []) {
  const {
    code,
    name,
    description = '',
    detail = '',
    link = null,
    tags = [],
    imageNames = {},
    videos = [],
  } = project;

  if (!code || !name) return {};

  const images = imagesList.map((image) => ({
    title: imageNames[image.file] ?? '',
    name: image.file,
    src: image.path,
  }));

  return {
    [code]: {
      name,
      description,
      detail,
      link,
      tags,
      images,
      videos,
    },
  };
}

let projects = {};
directories.forEach((dir) => {
  projects = {
    ...projects,
    ...parseProject(dir, getImages(dir.children, dir.code)),
  };
})

export default projects;
