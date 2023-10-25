type DanceStyle = {
  label: string,
  id: string,
  picture: string,
};

const DanceStyles: DanceStyle[] = [
  {
    label: "Lindy Hop",
    id: 'LH',
    picture: '',
  },
  {
    label: "West Coast Swing",
    id: 'WCS',
    picture: '',
  },
  {
    label: "East Coast Swing",
    id: 'ECS',
    picture: '',
  },
  {
    label: "Blues",
    id: 'BL',
    picture: '/img/dance_styles/blues.jpg',
  },
  {
    label: "Other",
    id: 'OTHR',
    picture: '',
  },
]

export default DanceStyles;
