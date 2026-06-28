export interface ChildItem {
  id?: number | string;
  name: string;
  icon?: string;
  items?: ChildItem[];
  item?: unknown;
  url?: string;
  color?: string;
  disabled?: boolean;
  subtitle?: string;
  badge?: boolean;
  badgeType?: string;
  badgeContent?: string;
  isActive?: boolean;
  external?: boolean;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: string;
  id?: number;
  to?: string;
  item?: MenuItem[];
  items?: ChildItem[];
  url?: string;
  disabled?: boolean;
  subtitle?: string;
  badgeType?: string;
  badge?: boolean;
  badgeContent?: string;
  isActive?: boolean;
  external?: boolean;
}

import { uniqueId } from "lodash";

const SidebarContent: MenuItem[] = [
  {
    heading: "AVIATONLY",
    items: [
      {
        id: uniqueId(),
        name: "Sell Aircraft",
        icon: "solar:jet-line-duotone",
        url: "/seller/upload",
      },
    ],
  },
  {
    heading: "Dashboard",
    items: [
      {
        id: uniqueId(),
        name: "Analytics",
        icon: "solar:chart-square-line-duotone",
        url: "/",
      },
      {
        id: uniqueId(),
        name: "eCommerce",
        icon: "solar:cart-line-duotone",
        url: "/dashboards/ecommerce",
      },
      {
        id: uniqueId(),
        name: "CRM Dashboard",
        icon: "solar:help-line-duotone",
        url: "/dashboards/crm-dashboard",
      }
    ],
  },
  {
    heading: "Apps",
    items: [
      {
        name: "AI",
        icon: "solar:star-circle-linear",
        id: uniqueId(),
        items: [
          {
            id: uniqueId(),
            name: "Chat",
            url: "/apps/chat-ai",
            badge: true,
            badgeType: "filled",
            badgeContent: "New",
          },
          {
            id: uniqueId(),
            name: "Image",
            url: "/apps/image-ai",
            badge: true,
            badgeType: "filled",
            badgeContent: "New",
          },
        ],
      },
      {
        id: uniqueId(),
        name: "Calendar",
        icon: "solar:calendar-linear",
        url: "/apps/calendar",
      },

      {
        id: uniqueId(),
        name: "Chats",
        icon: "solar:dialog-linear",
        url: "/apps/chats",
      },

      {
        id: uniqueId(),
        name: "Email",
        icon: "solar:letter-linear",
        url: "/apps/email",
      },

      {
        id: uniqueId(),
        name: "Notes",
        icon: "solar:notes-linear",
        url: "/apps/notes",
      },
      {
        id: uniqueId(),
        name: "Contacts",
        icon: "solar:users-group-rounded-linear",
        url: "/apps/contacts",
      },
      {
        name: "Invoice",
        id: uniqueId(),
        icon: "solar:bill-list-linear",
        items: [
          {
            id: uniqueId(),
            name: "List",
            url: "/apps/invoice/list",
          },
          {
            id: uniqueId(),
            name: "Details",
            url: "/apps/invoice/detail/PineappleInc",
          },
          {
            id: uniqueId(),
            name: "Create",
            url: "/apps/invoice/create",
          },
          {
            id: uniqueId(),
            name: "Edit",
            url: "/apps/invoice/edit/PineappleInc",
          },
        ],
      },
      {
        name: "User Profile",
        id: uniqueId(),
        icon: "solar:user-circle-linear",
        items: [
          {
            id: uniqueId(),
            name: "Profile",
            url: "/apps/user-profile/profile",
          },
          {
            id: uniqueId(),
            name: "Followers",
            url: "/apps/user-profile/followers",
          },
          {
            id: uniqueId(),
            name: "Friends",
            url: "/apps/user-profile/friends",
          },
          {
            id: uniqueId(),
            name: "Gallery",
            url: "/apps/user-profile/gallery",
          },
        ],
      },

      {
        name: "Blogs",
        id: uniqueId(),
        icon: "solar:sort-by-alphabet-linear",
        items: [
          {
            id: uniqueId(),
            name: "Blog Post",
            url: "/apps/blog/post",
          },
          {
            id: uniqueId(),
            name: "Blog Detail",
            url: "/apps/blog/detail/streaming-video-way-before-it-was-cool-go-dark-tomorrow",
          },
          {
            id: uniqueId(),
            name: "Blog Edit",
            url: "/apps/blog/edit",
          },
          {
            id: uniqueId(),
            name: "Blog Create",
            url: "/apps/blog/create",
          },
          {
            id: uniqueId(),
            name: "Manage Blog",
            url: "/apps/blog/manage-blog",
          },
        ],
      },
      {
        name: "Ecommerce",
        id: uniqueId(),
        icon: "solar:cart-large-2-linear",
        items: [
          {
            id: uniqueId(),
            name: "Shop",
            url: "/apps/ecommerce/shop",
          },
          {
            id: uniqueId(),
            name: "Details",
            url: "/apps/ecommerce/detail/3",
          },
          {
            id: uniqueId(),
            name: "List",
            url: "/apps/ecommerce/list",
          },
          {
            id: uniqueId(),
            name: "Checkout",
            url: "/apps/ecommerce/checkout",
          },
          {
            id: uniqueId(),
            name: "Add Product",
            url: "/apps/ecommerce/addproduct",
          },
          {
            id: uniqueId(),
            name: "Edit Product",
            url: "/apps/ecommerce/editproduct",
          },
        ],
      },
      {
        id: uniqueId(),
        name: "Kanban",
        icon: "solar:server-minimalistic-linear",
        url: "/apps/kanban",
      },
      {
        id: uniqueId(),
        name: "Tickets",
        icon: "solar:ticker-star-linear",
        url: "/apps/tickets",
      },
      {
        id: uniqueId(),
        icon: "solar:bedside-table-2-linear",
        name: "Customers",
        url: "/react-tables/user-datatable",
      },
      {
        id: uniqueId(),
        icon: "solar:bedside-table-4-linear",
        name: "Orders",
        url: "/react-tables/order-datatable",
      },
    ],
  },
  {
    heading: "UI ELEMENTS",
    items: [
      {
        name: "ShadCn",
        id: uniqueId(),
        icon: "solar:slash-square-linear",
        items: [

          {
            id: uniqueId(),
            name: "Button",
            url: "https://shadcnspace.com/components/button", external: true,
          },
          {
            id: uniqueId(),
            name: "Avatar",
            url: "https://shadcnspace.com/components/avatar", external: true,
          },
          {
            id: uniqueId(),
            name: "Badge",
            url: "https://shadcnspace.com/components/badge", external: true,
          },
          {
            id: uniqueId(),
            name: "Tooltip",
            url: "https://shadcnspace.com/components/tooltip", external: true,
          },
          {
            id: uniqueId(),
            name: "Input",
            url: "https://shadcnspace.com/components/input", external: true,
          },

          {
            id: uniqueId(),
            name: "Textarea",
            url: "https://shadcnspace.com/components/textarea", external: true,
          },
          {
            id: uniqueId(),
            name: "Switch",
            url: "https://shadcnspace.com/components/switch", external: true,
          },
          {
            id: uniqueId(),
            name: "Tab",
            url: "https://shadcnspace.com/components/tabs", external: true,
          },
          {
            id: uniqueId(),
            name: "Select",
            url: "https://shadcnspace.com/components/select", external: true,
          },
          {
            id: uniqueId(),
            name: "Checkbox",
            url: "https://shadcnspace.com/components/checkbox", external: true,
          },
          {
            id: uniqueId(),
            name: "Accordion",
            url: "https://shadcnspace.com/components/accordion", external: true,
          },
          {
            id: uniqueId(),
            name: "Card",
            url: "https://shadcnspace.com/components/card", external: true,
          },
          {
            id: uniqueId(),
            name: "Radio Group",
            url: "https://shadcnspace.com/components/radio-group", external: true,
          },

          {
            id: uniqueId(),
            name: "Datepicker",
            url: "https://shadcnspace.com/components/date-picker", external: true,
          },
        ],
      },


    ],
  },
  {
    heading: "FORM ELEMENTS",
    items: [
      {
        name: "Shadcn Forms",
        id: uniqueId(),
        icon: "solar:banknote-2-linear",
        items: [

          {
            id: uniqueId(),
            name: "Input",
            url: "https://shadcnspace.com/components/input", external: true,
          },
          {
            id: uniqueId(),
            name: "Select",
            url: "https://shadcnspace.com/components/select", external: true,
          },
          {
            id: uniqueId(),
            name: "Checkbox",
            url: "https://shadcnspace.com/components/checkbox", external: true,
          },
          {
            id: uniqueId(),
            name: "Radio",
            url: "https://shadcnspace.com/components/radio-group", external: true,
          },
          {
            id: uniqueId(),
            name: "Datepicker",
            url: "https://shadcnspace.com/components/date-picker", external: true,
          },
          {
            id: uniqueId(),
            name: "Select",
            url: "https://shadcnspace.com/components/select", external: true,
          },
        ],
      },

      {
        name: "Form layouts",
        id: uniqueId(),
        icon: "solar:documents-linear",
        items: [
          {
            id: uniqueId(),
            name: "Forms Layouts",
            url: "/forms/form-layouts",
          },
          {
            id: uniqueId(),
            name: "Forms Horizontal",
            url: "/forms/form-horizontal",
          },
          {
            id: uniqueId(),
            name: "Forms Vertical",
            url: "/forms/form-vertical",
          },
          {
            id: uniqueId(),
            name: "Form Validation",
            url: "/forms/form-validation",
          },
          {
            id: uniqueId(),
            name: "Form Examples",
            url: "/forms/form-example",
          },
          {
            id: uniqueId(),
            name: "Repeater Forms",
            url: "/forms/form-repeater",
          },
          {
            id: uniqueId(),
            name: "Form Wizard",
            url: "/forms/form-wizard",
          },
        ],
      },
      {
        name: "Form Addons",
        id: uniqueId(),
        icon: "solar:file-favourite-linear",
        items: [
          {
            id: uniqueId(),
            name: "Select2",
            url: "/forms/form-select2",
          },
          {
            id: uniqueId(),
            name: "Autocomplete",
            url: "/forms/form-autocomplete",
          },
          {
            id: uniqueId(),
            name: "Dropzone",
            url: "/forms/form-dropzone",
          },
        ],
      },
    ],
  },
  {
    heading: "Widgets",
    items: [
      {
        name: "Cards",
        id: uniqueId(),
        icon: "solar:card-linear",
        url: "https://shadcnspace.com/blocks/dashboard-ui/statistics-component", external: true

      },
      {
        name: "Banners",
        id: uniqueId(),
        icon: "solar:object-scan-linear",
        url: 'https://shadcnspace.com/blocks/dashboard-ui/widgets-component',
      },
      {
        name: "Charts",
        id: uniqueId(),
        icon: "solar:pie-chart-2-linear",
        url: 'https://shadcnspace.com/blocks/dashboard-ui/charts-component',

      },
    ],
  },
  {
    heading: "TABLES",
    items: [
      {
        name: "Shadcn Tables",
        id: uniqueId(),
        icon: "solar:tablet-linear",
        items: [
          {
            name: "Basic Table",
            id: uniqueId(),
            url: "/shadcn-tables/basic",
          },
          {
            name: "Striped Row Table",
            id: uniqueId(),
            url: "/shadcn-tables/striped-row",
          },
          {
            name: "Hover Table",
            id: uniqueId(),
            url: "/shadcn-tables/hover-table",
          },
          {
            name: "Checkbox Table",
            id: uniqueId(),
            url: "/shadcn-tables/checkbox-table",
          },
        ],
      },
      {
        name: "Tanstack Table",
        id: uniqueId(),
        icon: "solar:chart-square-linear",
        items: [
          {
            id: uniqueId(),
            name: "Basic",
            url: "/react-tables/basic",
          },
          {
            id: uniqueId(),
            name: "Dense",
            url: "/react-tables/dense",
          },
          {
            id: uniqueId(),
            name: "Sorting",
            url: "/react-tables/sorting",
          },
          {
            id: uniqueId(),
            name: "Filtering",
            url: "/react-tables/filtering",
          },
          {
            id: uniqueId(),
            name: "Pagination",
            url: "/react-tables/pagination",
          },
          {
            id: uniqueId(),
            name: "Row Selection",
            url: "/react-tables/row-selection",
          },
          {
            id: uniqueId(),
            name: "Column Visibility",
            url: "/react-tables/columnvisibility",
          },
          {
            id: uniqueId(),
            name: "Editable",
            url: "/react-tables/editable",
          },
          {
            id: uniqueId(),
            name: "Sticky",
            url: "/react-tables/sticky",
          },
          {
            id: uniqueId(),
            name: "Drag & Drop",
            url: "/react-tables/drag-drop",
          },
          {
            id: uniqueId(),
            name: "Empty",
            url: "/react-tables/empty",
          },
          {
            id: uniqueId(),
            name: "Expanding",
            url: "/react-tables/expanding",
          },
        ],
      },
    ],
  },
  {
    heading: "Charts",
    items: [
      {
        name: "ApexCharts",
        id: uniqueId(),
        icon: "solar:pie-chart-3-linear",
        items: [
          {
            id: uniqueId(),
            name: "Line Chart",
            url: "/charts/apex-charts/line",
          },
          {
            id: uniqueId(),
            name: "Area Chart",
            url: "/charts/apex-charts/area",
          },
          {
            id: uniqueId(),
            name: "Gradient Chart",
            url: "/charts/apex-charts/gradient",
          },
          {
            id: uniqueId(),
            name: "Candlestick",
            url: "/charts/apex-charts/candlestick",
          },
          {
            id: uniqueId(),
            name: "Column",
            url: "/charts/apex-charts/column",
          },
          {
            id: uniqueId(),
            name: "Doughnut & Pie",
            url: "/charts/apex-charts/doughnut",
          },
          {
            id: uniqueId(),
            name: "Radialbar & Radar",
            url: "/charts/apex-charts/radialbar",
          },
        ],
      },
      {
        name: "Shadcn Charts",
        id: uniqueId(),
        icon: "solar:chart-2-linear",
        items: [
          {
            id: uniqueId(),
            name: "Line Chart",
            url: "/charts/shadcn/line",
          },
          {
            id: uniqueId(),
            name: "Area Chart",
            url: "/charts/shadcn/area",
          },
          // {
          //   id: uniqueId(),
          //   name: "Gradient Chart",
          //   url: "/charts/apex-charts/gradient",
          // },
          {
            id: uniqueId(),
            name: "Radar",
            url: "/charts/shadcn/radar",
          },
          {
            id: uniqueId(),
            name: "Bar",
            url: "/charts/shadcn/bar",
          },
          {
            id: uniqueId(),
            name: "Doughnut & Pie",
            url: "/charts/shadcn/pie",
          },
          {
            id: uniqueId(),
            name: "Radialbar",
            url: "/charts/shadcn/radial",
          },
        ],
      },
    ],
  },
  {
    heading: "Pages",
    items: [
      {
        name: "Account Setting",
        icon: "solar:settings-minimalistic-linear",
        id: uniqueId(),
        url: "/theme-pages/account-settings",
      },
      {
        name: "FAQ",
        icon: "solar:question-circle-linear",
        id: uniqueId(),
        url: "/theme-pages/faq",
      },
      {
        name: "Pricing",
        icon: "solar:tag-price-linear",
        id: uniqueId(),
        url: "/theme-pages/pricing",
      },

      {
        name: "Roll Base Access",
        icon: "solar:accessibility-linear",
        id: uniqueId(),
        url: "/theme-pages/casl",
      },
      {
        id: uniqueId(),
        name: "Integrations",
        icon: "solar:home-add-linear",
        url: "/theme-pages/inetegration",
        badge: true,
        badgeType: "filled",
        badgeContent: "New",
      },
      {
        id: uniqueId(),
        name: "API Keys",
        icon: "solar:key-linear",
        url: "/theme-pages/apikey",
        badge: true,
        badgeType: "filled",
        badgeContent: "New",
      },

      {
        id: uniqueId(),
        name: "Empty Pages",
        icon: "solar:document-linear",
        items: [
          {
            id: uniqueId(),
            name: "Empty Page 1",
            url: "/theme-pages/empty-page/empty-1",
          },
          {
            id: uniqueId(),
            name: "Empty Page 2",
            url: "/theme-pages/empty-page/empty-2",
          },
          {
            id: uniqueId(),
            name: "Empty Page 3",
            url: "/theme-pages/empty-page/empty-3",
          },
          {
            id: uniqueId(),
            name: "Empty Page 4",
            url: "/theme-pages/empty-page/empty-4",
          },
        ],
      }


    ],

  },
  {
    heading: "Icons",
    items: [
      {
        id: uniqueId(),
        name: "Iconify Icons",
        icon: "solar:structure-linear",
        url: "/icons/iconify",
      },
    ],
  },
  {
    heading: "Auth",
    items: [
      {
        id: uniqueId(),
        name: "Error",
        icon: "solar:link-broken-minimalistic-linear",
        url: "/auth/error",
      },
      {
        name: "Login",
        id: uniqueId(),
        icon: "solar:login-2-linear",
        items: [
          {
            id: uniqueId(),
            name: "Side Login",
            url: "/auth/auth1/login",
          },
          {
            id: uniqueId(),
            name: "Boxed Login",
            url: "/auth/auth2/login",
          },
        ],
      },
      {
        name: "Register",
        id: uniqueId(),
        icon: "solar:user-plus-rounded-linear",
        items: [
          {
            id: uniqueId(),
            name: "Side Register",
            url: "/auth/auth1/register",
          },
          {
            id: uniqueId(),
            name: "Boxed Register",
            url: "/auth/auth2/register",
          },
        ],
      },
      {
        name: "Forgot Password",
        id: uniqueId(),
        icon: "solar:password-linear",
        items: [
          {
            id: uniqueId(),
            name: "Side Forgot Pwd",
            url: "/auth/auth1/forgot-password",
          },
          {
            id: uniqueId(),
            name: "Boxed Forgot Pwd",
            url: "/auth/auth2/forgot-password",
          },
        ],
      },
      {
        name: "Two Steps",
        id: uniqueId(),
        icon: "solar:shield-keyhole-minimalistic-linear",
        items: [
          {
            id: uniqueId(),
            name: "Side Two Steps",
            url: "/auth/auth1/two-steps",
          },
          {
            id: uniqueId(),
            name: "Boxed Two Steps",
            url: "/auth/auth2/two-steps",
          },
        ],
      },
      {
        id: uniqueId(),
        name: "Maintenance",
        icon: "solar:settings-linear",
        url: "/auth/maintenance",
      },
      {
        id: uniqueId(),
        name: "Menu Level",
        icon: "solar:chart-square-line-duotone",
        items: [
          {
            id: uniqueId(),
            name: "Level 1",

            items: [
              {
                id: uniqueId(),
                name: "Level 1.1",
                url: "/menu-level/level-1.1",
              },
            ],
          },
        ],
      },
    ],
  },
];

export default SidebarContent;
