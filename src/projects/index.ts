import directories from './structure.json';

type TypeFile = {
  type: string;
  name: string;
};

type TypeFolder = {
  type: string;
  code: string;
  name: string;
  children: TypeFile[];
};

type TypeImageRaw = {
  file: string;
  path: string;
};

export type TypeImage = {
  name: string;
  src: string;
};

export type TypeProject = {
  name: string;
  images: TypeImage[];
};

export type TypeProjects = {
  [index: string]: TypeProject;
};

function getImages(children: TypeFile[], folderName: string) {
  return children.map((file) => ({
    file: file.name,
    path: `/assets/images/projects/${folderName}/${file.name}`,
  }));
}

function parseProject(project: TypeFolder, imagesList: TypeImageRaw[] = []) {
  const { code, name } = project;

  if (!code || !name) return {};

  const images: TypeImage[] = imagesList.map((image) => ({
    name: image.file,
    src: image.path,
  }));

  return {
    [code]: {
      name,
      images,
    },
  };
}

const projects: TypeProjects = directories.reduce(
  (acc, dir: TypeFolder) => ({
    ...acc,
    ...parseProject(dir, getImages(dir.children, dir.code)),
  }),
  {},
);

export default projects;
