import { uniqueId } from 'lodash'


export interface MenuItem {
  id: string;
  title: string;
  icon?: string;
  href: string;
  column?: number;

  // optional states
  disabled?: boolean;
  subtitle?: string;

  // badge support
  badge?: boolean;
  badgeType?: "filled" | "outlined";
  badgeContent?: string;

  // recursive children
  children?: MenuItem[];
  external?: boolean;
}



const Menuitems: MenuItem[] = [
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: 'solar:home-linear',
    href: '',
    children: [
      {
        title: 'Analytics',
        icon: 'solar:chart-square-line-duotone',
        id: uniqueId(),
        href: '/',
      },
      {
        title: 'eCommerce',
        icon: 'solar:cart-line-duotone',
        id: uniqueId(),
        href: '/dashboards/ecommerce',
      },
      {
        title: 'CRM Dashboard',
        icon: 'solar:help-line-duotone',
        id: uniqueId(),
        href: '/dashboards/crm-dashboard',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Apps',
    icon: 'solar:archive-down-linear',
    href: '',
    children: [
      {
        id: uniqueId(),
        title: 'AI',
        icon: 'solar:star-circle-linear',
        href: '',
        children: [
          {
            title: 'Chat',
            id: uniqueId(),
            href: '/apps/chat-ai',
            badge: true,
            badgeType: 'filled',
            badgeContent: 'New',
          },
          {
            title: 'Image',
            id: uniqueId(),
            href: '/apps/image-ai',
            badge: true,
            badgeType: 'filled',
            badgeContent: 'New',
          },
        ],
      },
      {
        id: uniqueId(),
        title: 'Calendar',
        icon: 'solar:calendar-linear',
        href: '/apps/calendar',
      },
      {
        id: uniqueId(),
        title: 'Chats',
        icon: 'solar:dialog-linear',
        href: '/apps/chats',
      },

      {
        id: uniqueId(),
        title: 'Email',
        icon: 'solar:letter-linear',
        href: '/apps/email',
      },

      {
        id: uniqueId(),
        title: 'Notes',
        icon: 'solar:notes-linear',
        href: '/apps/notes',
      },
      {
        id: uniqueId(),
        title: 'Contacts',
        icon: 'solar:users-group-rounded-linear',
        href: '/apps/contacts',
      },
      {
        title: 'Invoice',
        id: uniqueId(),
        icon: 'solar:bill-list-linear',
        href: '',
        children: [
          {
            id: uniqueId(),
            title: 'List',
            href: '/apps/invoice/list',
          },
          {
            id: uniqueId(),
            title: 'Details',
            href: '/apps/invoice/detail/PineappleInc',
          },
          {
            id: uniqueId(),
            title: 'Create',
            href: '/apps/invoice/create',
          },
          {
            id: uniqueId(),
            title: 'Edit',
            href: '/apps/invoice/edit/PineappleInc',
          },
        ],
      },
      {
        title: 'User Profile',
        id: uniqueId(),
        icon: 'solar:user-circle-linear',
        href: '',
        children: [
          {
            id: uniqueId(),
            title: 'Profile',
            href: '/apps/user-profile/profile',
          },
          {
            id: uniqueId(),
            title: 'Followers',
            href: '/apps/user-profile/followers',
          },
          {
            id: uniqueId(),
            title: 'Friends',
            href: '/apps/user-profile/friends',
          },
          {
            id: uniqueId(),
            title: 'Gallery',
            href: '/apps/user-profile/gallery',
          },
        ],
      },
      {
        title: 'Blogs',
        id: uniqueId(),
        icon: 'solar:sort-by-alphabet-linear',
        href: '',
        children: [
          {
            id: uniqueId(),
            title: 'Blog Post',
            href: '/apps/blog/post',
          },
          {
            id: uniqueId(),
            title: 'Blog Detail',
            href: '/apps/blog/detail/streaming-video-way-before-it-was-cool-go-dark-tomorrow',
          },
          {
            id: uniqueId(),
            title: 'Blog Edit',
            href: '/apps/blog/edit',
          },
          {
            id: uniqueId(),
            title: 'Blog Create',
            href: '/apps/blog/create',
          },
          {
            id: uniqueId(),
            title: 'Manage Blog',
            href: '/apps/blog/manage-blog',
          },
        ],
      },
      {
        title: 'Ecommerce',
        id: uniqueId(),
        icon: 'solar:cart-large-2-linear',
        href: '',
        children: [
          {
            id: uniqueId(),
            title: 'Shop',
            href: '/apps/ecommerce/shop',
          },
          {
            id: uniqueId(),
            title: 'Details',
            href: '/apps/ecommerce/detail/3',
          },
          {
            id: uniqueId(),
            title: 'List',
            href: '/apps/ecommerce/list',
          },
          {
            id: uniqueId(),
            title: 'Checkout',
            href: '/apps/ecommerce/checkout',
          },
          {
            id: uniqueId(),
            title: 'Add Product',
            href: '/apps/ecommerce/addproduct',
          },
          {
            id: uniqueId(),
            title: 'Edit Product',
            href: '/apps/ecommerce/editproduct',
          },
        ],
      },
      {
        id: uniqueId(),
        title: 'Kanban',
        icon: 'solar:server-minimalistic-linear',
        href: '/apps/kanban',
      },
      {
        id: uniqueId(),
        title: 'Tickets',
        icon: 'solar:ticker-star-linear',
        href: '/apps/tickets',
      },
      {
        id: uniqueId(),
        icon: 'solar:bedside-table-2-linear',
        title: 'Customers',
        href: '/react-tables/user-datatable',
      },
      {
        id: uniqueId(),
        icon: 'solar:bedside-table-4-linear',
        title: 'Orders',
        href: '/react-tables/order-datatable',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Ui',
    icon: 'solar:widget-linear',
    href: '',
    children: [
      {
        id: uniqueId(),
        title: 'ShadCn',
        icon: 'solar:slash-square-linear',
        href: '',
        children: [
          {
            id: uniqueId(),
            title: 'Button',
            href: 'https://shadcnspace.com/components/button',
            external: true,
          },
          {
            id: uniqueId(),
            title: 'Avatar',
            href: 'https://shadcnspace.com/components/avatar',
            external: true,
          },
          {
            id: uniqueId(),
            title: 'Badge',
            href: 'https://shadcnspace.com/components/badge',
            external: true,
          },
          {
            id: uniqueId(),
            title: 'Tooltip',
            href: 'https://shadcnspace.com/components/tooltip',
            external: true,
          },
          {
            id: uniqueId(),
            title: 'Input',
            href: 'https://shadcnspace.com/components/input',
            external: true,
          },

          {
            id: uniqueId(),
            title: 'Textarea',
            href: 'https://shadcnspace.com/components/textarea',
            external: true,
          },
          {
            id: uniqueId(),
            title: 'Switch',
            href: 'https://shadcnspace.com/components/switch',
            external: true,
          },
          {
            id: uniqueId(),
            title: 'Tab',
            href: 'https://shadcnspace.com/components/tabs',
            external: true,
          },
          {
            id: uniqueId(),
            title: 'Select',
            href: 'https://shadcnspace.com/components/select',
            external: true,
          },
          {
            id: uniqueId(),
            title: 'Checkbox',
            href: 'https://shadcnspace.com/components/checkbox',
            external: true,
          },
          {
            id: uniqueId(),
            title: 'Accordion',
            href: 'https://shadcnspace.com/components/accordion',
            external: true,
          },
          {
            id: uniqueId(),
            title: 'Card',
            href: 'https://shadcnspace.com/components/card',
            external: true,
          },
          {
            id: uniqueId(),
            title: 'Radio Group',
            href: 'https://shadcnspace.com/components/radio-group',
            external: true,
          },

          {
            id: uniqueId(),
            title: 'Datepicker',
            href: 'https://shadcnspace.com/components/date-picker',
            external: true,
          },
        ],
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Forms',
    icon: 'solar:documents-linear',
    href: '',
    children: [
      {
        title: 'Shadcn Forms',
        id: uniqueId(),
        icon: 'solar:banknote-2-linear',
        href: '',
        children: [
          {
            id: uniqueId(),
            title: 'Input',
            href: 'https://shadcnspace.com/components/input',
            external: true,
          },
          {
            id: uniqueId(),
            title: 'Select',
            href: 'https://shadcnspace.com/components/select',
            external: true,
          },
          {
            id: uniqueId(),
            title: 'Checkbox',
            href: 'https://shadcnspace.com/components/checkbox',
            external: true,
          },
          {
            id: uniqueId(),
            title: 'Radio',
            href: 'https://shadcnspace.com/components/radio-group',
            external: true,
          },
          {
            id: uniqueId(),
            title: 'Datepicker',
            href: 'https://shadcnspace.com/components/date-picker',
            external: true,
          },
          {
            id: uniqueId(),
            title: 'Select',
            href: 'https://shadcnspace.com/components/select',
            external: true,
          },
        ],
      },

      {
        title: 'Form layouts',
        id: uniqueId(),
        icon: 'solar:documents-linear',
        href: '',
        children: [
          {
            id: uniqueId(),
            title: 'Forms Layouts',
            href: '/forms/form-layouts',
          },
          {
            id: uniqueId(),
            title: 'Forms Horizontal',
            href: '/forms/form-horizontal',
          },
          {
            id: uniqueId(),
            title: 'Forms Vertical',
            href: '/forms/form-vertical',
          },
          {
            id: uniqueId(),
            title: 'Form Validation',
            href: '/forms/form-validation',
          },
          {
            id: uniqueId(),
            title: 'Form Examples',
            href: '/forms/form-example',
          },
          {
            id: uniqueId(),
            title: 'Repeater Forms',
            href: '/forms/form-repeater',
          },
          {
            id: uniqueId(),
            title: 'Form Wizard',
            href: '/forms/form-wizard',
          },
        ],
      },
      {
        title: 'Form Addons',
        id: uniqueId(),
        icon: 'solar:file-favourite-linear',
        href: '',
        children: [
          {
            id: uniqueId(),
            title: 'Select2',
            href: '/forms/form-select2',
          },
          {
            id: uniqueId(),
            title: 'Autocomplete',
            href: '/forms/form-autocomplete',
          },
          {
            id: uniqueId(),
            title: 'Dropzone',
            href: '/forms/form-dropzone',
          },
        ],
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Widgets',
    icon: 'solar:widget-4-linear',
    href: '',
    children: [
      {
        title: 'Cards',
        id: uniqueId(),
        icon: 'solar:card-linear',
        href: 'https://shadcnspace.com/blocks/dashboard-ui/statistics-component',
        external: true,
      },
      {
        title: 'Banners',
        id: uniqueId(),
        icon: 'solar:object-scan-linear',
        href: 'https://shadcnspace.com/blocks/dashboard-ui/widgets-component',
      },
      {
        title: 'Charts',
        id: uniqueId(),
        icon: 'solar:pie-chart-2-linear',
        href: 'https://shadcnspace.com/blocks/dashboard-ui/charts-component',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Tables',
    icon: 'solar:sidebar-minimalistic-linear',
    href: '',
    children: [
      {
        title: 'Shadcn Tables',
        id: uniqueId(),
        icon: 'solar:tablet-linear',
        href: '',
        children: [
          {
            title: 'Basic Table',
            id: uniqueId(),
            href: '/shadcn-tables/basic',
          },
          {
            title: 'Striped Row Table',
            id: uniqueId(),
            href: '/shadcn-tables/striped-row',
          },
          {
            title: 'Hover Table',
            id: uniqueId(),
            href: '/shadcn-tables/hover-table',
          },
          {
            title: 'Checkbox Table',
            id: uniqueId(),
            href: '/shadcn-tables/checkbox-table',
          },
        ],
      },
      {
        title: 'Tanstack Table',
        id: uniqueId(),
        icon: 'solar:chart-square-linear',
        href: '',
        children: [
          {
            id: uniqueId(),
            title: 'Basic',
            href: '/react-tables/basic',
          },
          {
            id: uniqueId(),
            title: 'Dense',
            href: '/react-tables/dense',
          },
          {
            id: uniqueId(),
            title: 'Sorting',
            href: '/react-tables/sorting',
          },
          {
            id: uniqueId(),
            title: 'Filtering',
            href: '/react-tables/filtering',
          },
          {
            id: uniqueId(),
            title: 'Pagination',
            href: '/react-tables/pagination',
          },
          {
            id: uniqueId(),
            title: 'Row Selection',
            href: '/react-tables/row-selection',
          },
          {
            id: uniqueId(),
            title: 'Column Visibility',
            href: '/react-tables/columnvisibility',
          },
          {
            id: uniqueId(),
            title: 'Editable',
            href: '/react-tables/editable',
          },
          {
            id: uniqueId(),
            title: 'Sticky',
            href: '/react-tables/sticky',
          },
          {
            id: uniqueId(),
            title: 'Drag & Drop',
            href: '/react-tables/drag-drop',
          },
          {
            id: uniqueId(),
            title: 'Empty',
            href: '/react-tables/empty',
          },
          {
            id: uniqueId(),
            title: 'Expanding',
            href: '/react-tables/expanding',
          },
        ],
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Charts',
    icon: 'solar:pie-chart-2-linear',
    href: '',
    children: [
      {
        title: 'ApexCharts',
        id: uniqueId(),
        icon: 'solar:pie-chart-3-linear',
        href: '',
        children: [
          {
            id: uniqueId(),
            title: 'Line Chart',
            href: '/charts/apex-charts/line',
          },
          {
            id: uniqueId(),
            title: 'Area Chart',
            href: '/charts/apex-charts/area',
          },
          {
            id: uniqueId(),
            title: 'Gradient Chart',
            href: '/charts/apex-charts/gradient',
          },
          {
            id: uniqueId(),
            title: 'Candlestick',
            href: '/charts/apex-charts/candlestick',
          },
          {
            id: uniqueId(),
            title: 'Column',
            href: '/charts/apex-charts/column',
          },
          {
            id: uniqueId(),
            title: 'Doughnut & Pie',
            href: '/charts/apex-charts/doughnut',
          },
          {
            id: uniqueId(),
            title: 'Radialbar & Radar',
            href: '/charts/apex-charts/radialbar',
          },
        ],
      },
      {
        title: 'Shadcn Charts',
        id: uniqueId(),
        icon: 'solar:chart-2-linear',
        href: '',
        children: [
          {
            id: uniqueId(),
            title: 'Line Chart',
            href: '/charts/shadcn/line',
          },
          {
            id: uniqueId(),
            title: 'Area Chart',
            href: '/charts/shadcn/area',
          },
          {
            id: uniqueId(),
            title: 'Radar',
            href: '/charts/shadcn/radar',
          },
          {
            id: uniqueId(),
            title: 'Bar',
            href: '/charts/shadcn/bar',
          },
          {
            id: uniqueId(),
            title: 'Doughnut & Pie',
            href: '/charts/shadcn/pie',
          },
          {
            id: uniqueId(),
            title: 'Radialbar',
            href: '/charts/shadcn/radial',
          },
        ],
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Pages',
    icon: 'solar:book-linear',
    href: '',
    children: [
      {
        title: 'Account Setting',
        icon: 'solar:settings-minimalistic-linear',
        id: uniqueId(),
        href: '/theme-pages/account-settings',
      },
      {
        title: 'FAQ',
        icon: 'solar:question-circle-linear',
        id: uniqueId(),
        href: '/theme-pages/faq',
      },
      {
        title: 'Pricing',
        icon: 'solar:tag-price-linear',
        id: uniqueId(),
        href: '/theme-pages/pricing',
      },

      {
        title: 'Roll Base Access',
        icon: 'solar:accessibility-linear',
        id: uniqueId(),
        href: '/theme-pages/casl',
      },
      {
        title: 'Integrations',
        id: uniqueId(),
        icon: 'solar:home-add-linear',
        href: '/theme-pages/inetegration',
        badge: true,
        badgeType: 'filled',
        badgeContent: 'New',
      },
      {
        id: uniqueId(),
        title: 'API Keys',
        icon: 'solar:key-linear',
        href: '/theme-pages/apikey',
        badge: true,
        badgeType: 'filled',
        badgeContent: 'New',
      },

      {
        id: uniqueId(),
        title: 'Empty Pages',
        icon: 'solar:document-linear',
        href: '',
        children: [
          {
            id: uniqueId(),
            title: 'Empty Page 1',
            href: '/theme-pages/empty-page/empty-1',
          },
          {
            id: uniqueId(),
            title: 'Empty Page 2',
            href: '/theme-pages/empty-page/empty-2',
          },
          {
            id: uniqueId(),
            title: 'Empty Page 3',
            href: '/theme-pages/empty-page/empty-3',
          },
          {
            id: uniqueId(),
            title: 'Empty Page 4',
            href: '/theme-pages/empty-page/empty-4',
          },
        ],
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Icons',
    icon: 'solar:structure-linear',
    href: '',
    children: [
      {
        id: uniqueId(),
        title: 'Iconify Icons',
        icon: 'solar:structure-linear',
        href: '/icons/iconify',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Auth',
    icon: 'solar:shield-keyhole-linear',
    href: '',
    children: [
      {
        id: uniqueId(),
        title: 'Error',
        icon: 'solar:link-broken-minimalistic-linear',
        href: '/auth/error',
      },
      {
        title: 'Login',
        id: uniqueId(),
        icon: 'solar:login-2-linear',
        href: '',
        children: [
          {
            id: uniqueId(),
            title: 'Side Login',
            href: '/auth/auth1/login',
          },
          {
            id: uniqueId(),
            title: 'Boxed Login',
            href: '/auth/auth2/login',
          },
        ],
      },
      {
        title: 'Register',
        id: uniqueId(),
        icon: 'solar:user-plus-rounded-linear',
        href: '',
        children: [
          {
            id: uniqueId(),
            title: 'Side Register',
            href: '/auth/auth1/register',
          },
          {
            id: uniqueId(),
            title: 'Boxed Register',
            href: '/auth/auth2/register',
          },
        ],
      },
      {
        title: 'Forgot Password',
        id: uniqueId(),
        icon: 'solar:password-linear',
        href: '',
        children: [
          {
            id: uniqueId(),
            title: 'Side Forgot Pwd',
            href: '/auth/auth1/forgot-password',
          },
          {
            id: uniqueId(),
            title: 'Boxed Forgot Pwd',
            href: '/auth/auth2/forgot-password',
          },
        ],
      },
      {
        title: 'Two Steps',
        id: uniqueId(),
        icon: 'solar:shield-keyhole-minimalistic-linear',
        href: '',
        children: [
          {
            id: uniqueId(),
            title: 'Side Two Steps',
            href: '/auth/auth1/two-steps',
          },
          {
            id: uniqueId(),
            title: 'Boxed Two Steps',
            href: '/auth/auth2/two-steps',
          },
        ],
      },
      {
        id: uniqueId(),
        title: 'Maintenance',
        icon: 'solar:settings-linear',
        href: '/auth/maintenance',
      },
      {
        id: uniqueId(),
        title: 'Menu Level',
        icon: 'solar:chart-square-line-duotone',
        href: '',
        children: [
          {
            id: uniqueId(),
            title: 'Level 1',
            href: '',
            children: [
              {
                id: uniqueId(),
                title: 'Level 1.1',
                href: '/menu-level/level-1.1',
              },
            ],
          },
        ],
      },
    ],
  },
]
export default Menuitems
