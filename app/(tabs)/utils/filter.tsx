import * as ImageManipulator from "expo-image-manipulator";

export const applyFilter = async (
  base64Image: string,
  filterType: string
): Promise<string> => {
  let actions: ImageManipulator.Action[] = [];

  switch (filterType) {
    case "vertical flip":
      actions.push({ flip: ImageManipulator.FlipType.Vertical });
      break;
    case "horizontal flip":
      actions.push({ flip: ImageManipulator.FlipType.Horizontal });
      break;
    case "rotate":
      actions.push({ rotate: 90 });
      break;
    default:
      break;
  }

  const result = await ImageManipulator.manipulateAsync(
    `data:image/png;base64,${base64Image}`,
    actions,
    { base64: true }
  );

  return result.base64 || "";
};
