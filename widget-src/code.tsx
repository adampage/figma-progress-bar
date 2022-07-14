const { widget } = figma
const { AutoLayout, SVG, Text, Rectangle, useSyncedState, usePropertyMenu } = widget

const minCount = 0
const initCount = 0
const minTarget = 0
const initTarget = 5
const widthWidget = 240
const paddingWidget = 20
const heightProgressBar = 24

const optionsColorProgressBar = [
  { option: "#5963FF", tooltip: "Blue" },
  { option: "#1B26BB", tooltip: "Dark Blue" },
  { option: "#905BA4", tooltip: "Lavender" },
  { option: "#EB6100", tooltip: "Orange" },
  { option: "#8AAF3E", tooltip: "Green" },
  { option: "#FF545E", tooltip: "Red" },
  { option: "#CA9000", tooltip: "Gold" }
]

const colorDefault = optionsColorProgressBar[0].option

const srcButtonInc = `
<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="30" height="30" rx="4" fill="#111"/>
  <path d="M15.9375 7.5H14.0625V14.0625H7.5V15.9375H14.0625V22.5H15.9375V15.9375H22.5V14.0625H15.9375V7.5Z" fill="#fff" fill-opacity="1"/>
</svg>
`

const srcButtonDec = `
<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="30" height="30" rx="4" fill="#111"/>
  <rect x="7.5" y="14.0625" width="15" height="1.875" fill="#fff" fill-opacity="1"/>
</svg>
`

function ProgressBar() {
  const [colorProgressBar, setColorProgressBar] = useSyncedState("colorProgressBar", colorDefault)
  const [numCount, setCount] = useSyncedState("count", initCount)
  const [numTarget, setTarget] = useSyncedState("target", initTarget)
  const propertyMenu: WidgetPropertyMenuItem[] = []

  propertyMenu.push({
    tooltip: 'Target - 1',
    propertyName: 'decTarget',
    itemType: 'action',
  })

  propertyMenu.push({
    tooltip: 'Target + 1',
    propertyName: 'incTarget',
    itemType: 'action',
  })

  propertyMenu.push({
    itemType: 'separator',
  })

  propertyMenu.push({
    itemType: 'color-selector',
    propertyName: 'colorProgressBar',
    tooltip: 'Progress bar color',
    selectedOption: colorDefault,
    options: optionsColorProgressBar,
  })

  propertyMenu.push({
    tooltip: 'Reset',
    propertyName: 'reset',
    itemType: 'action',
  })

  usePropertyMenu(propertyMenu, ({ propertyName, propertyValue }) => {
    if (propertyName === 'colorProgressBar' && propertyValue) {
      setColorProgressBar(propertyValue)
    } else if (propertyName === 'incProgress' && numCount < numTarget) {
      setCount(numCount + 1)
    } else if (propertyName === 'decProgress' && numCount > initCount) {
      setCount(numCount - 1)
    } else if (propertyName === 'incTarget') {
      setTarget(numTarget + 1)
    } else if (propertyName === 'decTarget' && numTarget > minTarget) {
      setTarget(numTarget - 1)
      if (numCount >= numTarget) {
        setCount(numTarget - 1)
      }
    } else if (propertyName === 'reset') {
      setCount(initCount)
      setTarget(initTarget)
    }
  })

  const widthContainer = widthWidget - (paddingWidget * 2)
  const widthProgressBar = (numCount / numTarget) * widthContainer

  return (
    <AutoLayout
      direction="vertical"
      verticalAlignItems="center"
      width={widthWidget}
      padding={paddingWidget}
    >
      <AutoLayout
        width="fill-parent"
        height={heightProgressBar}
        fill="#fff"
        stroke="#666"
        strokeAlign="inside"
        cornerRadius={2}
      >
        <AutoLayout
          positioning="absolute"
          x={0}
          y={0}
          width={widthContainer}
          height={heightProgressBar}
        >
          <AutoLayout
            verticalAlignItems="center"
            height="fill-parent"
            padding={8}
          >
            <Text fontSize={12} fontWeight={900} fill="#666">
              {numCount} of {numTarget}
            </Text>
          </AutoLayout>
        </AutoLayout>
        <AutoLayout
          positioning="absolute"
          x={0}
          y={0}
          width={widthProgressBar || 0.01}
          height={heightProgressBar}
          fill={numCount < numTarget ? colorProgressBar : colorProgressBar}
        >
          <AutoLayout
            verticalAlignItems="center"
            height="fill-parent"
            padding={8}
          >
            <Text fontSize={12} fontWeight={900} fill="#fff">
              {numCount} of {numTarget}
            </Text>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>


      <AutoLayout
        positioning="absolute"
        x={0}
        y={paddingWidget}
        width={widthWidget / 2}
        height={heightProgressBar}
        verticalAlignItems="center"
        opacity={0.25}
        hoverStyle={{
          opacity: 1
        }}
        onClick={() => {
          if (numCount > initCount) {
            setCount(numCount - 1)
          }
        }}
      >
        <Text
          width={paddingWidget}
          horizontalAlignText="center"
          fontSize={12}
          fontWeight={900}
          fill="#000"
        >
          ◀
        </Text>
      </AutoLayout>
      <AutoLayout
        positioning="absolute"
        x={widthWidget / 2}
        y={paddingWidget}
        width={widthWidget / 2}
        height={heightProgressBar}
        verticalAlignItems="center"
        horizontalAlignItems="end"
        opacity={0.25}
        hoverStyle={{
          opacity: 1
        }}
        onClick={() => {
          if (numCount < numTarget) {
            setCount(numCount + 1)
          }
        }}
      >
        <Text
          width={paddingWidget}
          horizontalAlignText="center"
          fontSize={12}
          fontWeight={900}
          fill="#000"
        >
          ▶
        </Text>
      </AutoLayout>
    </AutoLayout>
  )
}

widget.register(ProgressBar)
