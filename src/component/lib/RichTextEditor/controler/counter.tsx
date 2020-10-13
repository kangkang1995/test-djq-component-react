export default function (obj) {
  let count = 0;
  obj.blocks.forEach(function (item) {
    count += item.text.length;
  });
  return count;
}