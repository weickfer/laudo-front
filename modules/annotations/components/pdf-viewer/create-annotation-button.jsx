export function CreateAnnotationButton(props) {
  // const takeScreenshot = () => {
  //   gl.render(scene, camera);

  //   const screenshotDataURL = gl.domElement.toDataURL('image/png');

  //   onScreenshot(screenshotDataURL)
  // };

  return (
    <button {...props} className='w-full h-8 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:bg-gray-600 disabled:cursor-not-allowed'>
      Criar um apontamento
    </button>
  )
}
