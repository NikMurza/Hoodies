export const GetChart = () =>
  Promise.resolve({
    json: { chart: {} },
    image: 'testImage',
    toolTipMap: 'testToolTipImageMap',
  });

export const GetEmptyChart = () => Promise.resolve({});

export const GetSSBIVisualizersResultMany = () =>
  Promise.resolve({
    data: {
      GetSSBIVisualizersResult: {
        its: {
          it: [
            {
              k: '1',
              x: 1000,
              y: 100,
              height: 100000,
              width: 2000,
              type: 'Grid',
              metaModelKey: 1,
              parentKey: '2',
              chartType: '',
            },
            {
              k: '2',
              x: 2000,
              y: 2100,
              height: 200000,
              width: 2000,
              type: 'Grid',
              metaModelKey: 2,
              parentKey: '2',
              chartType: '',
            },
          ],
        },
      },
    },
  });

export const GetSSBIVisualizersResultOne = () =>
  Promise.resolve({
    data: {
      GetSSBIVisualizersResult: {
        its: {
          it: [
            {
              k: '1',
              x: 1000,
              y: 100,
              height: 100000,
              width: 2000,
              type: 'Grid',
              metaModelKey: 1,
              parentKey: '2',
              chartType: '',
            },
          ],
        },
      },
    },
  });

export const GetSSBIVisualizersResultZero = () => Promise.resolve({});

export const SSBIVisualizersDeleteResultTrue = () =>
  Promise.resolve({
    data: {
      SSBIVisualizersDeleteResult: true,
    },
  });

export const SSBIVisualizersDeleteResultFalse = () =>
  Promise.resolve({
    data: {
      SSBIVisualizersDeleteResult: false,
    },
  });

export const SSBIVisualizersAddResult = () =>
  Promise.resolve({
    data: {
      SSBIVisualizersAddResult: {
        k: 1,
        metaModelKey: 1,
        parentKey: 2,
      },
    },
  });

export const SSBIVisualizersAddResultEmpty = () =>
  Promise.resolve({
    data: {
      SSBIVisualizersAddResult: {},
    },
  });
