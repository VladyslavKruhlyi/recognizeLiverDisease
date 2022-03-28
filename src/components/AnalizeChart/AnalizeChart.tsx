import React from 'react';

import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';

import { IAnalizeChartProps } from './Types';

const AnalizeChart: React.FC<IAnalizeChartProps> = ({ data, typeResult }): JSX.Element => (
  <div>
    <BarChart
      style={{ marginTop: 30 }}
      width={730}
      height={250}
      data={data.map(chart => ({
        ...chart,
        Норма: Math.round(chart['Норма'] * 1000) / 1000,
        Патологія: Math.round(chart['Патологія'] * 1000) / 1000,
      }))}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="Норма" fill="#82ca9d" />
      <Bar dataKey="Патологія" fill="#ff0000" />
    </BarChart>
    {Object.keys(typeResult).map(key => (
      <p key={key}>
        {key}: {typeResult[key]}
      </p>
    ))}
  </div>
);

export default AnalizeChart;
