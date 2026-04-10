import * as React from "react";

export interface Column {
  id: string;
  name: string;
  type: "string" | "number" | "date";
}

export interface TableSource {
  id: string;
  name: string;
  columns: Column[];
  data: any[];
}

export interface ReportComponent {
  id: string;
  type: "table" | "chart" | "text";
  title: string;
  tableId?: string;
  config: {
    content?: string;
    visibleColumns?: string[];
    chartType?: "bar" | "line" | "pie";
    xAxisKey?: string;
    yAxisKey?: string;
  };
}

export interface ReportTemplate {
  id: string;
  name: string;
  tableIds: string[]; // IDs of tables this template can access
  components: ReportComponent[];
  style: {
    primaryColor: string;
    fontSize: string;
  };
}

export interface Folder {
  id: string;
  name: string;
  reportIds: string[];
}

export interface PublishedReport {
  id: string;
  title: string;
  templateId: string;
  publishedAt: string;
  isBookmarked: boolean;
  headers: string[];
  data: any[][];
  attachments: string[];
  components: ReportComponent[];
  tables: TableSource[];
}
