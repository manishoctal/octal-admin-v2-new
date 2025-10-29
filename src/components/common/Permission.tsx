type PermissionOption = {
    add?: boolean;
    edit?: boolean;
    view?: boolean;
    shownView?: boolean;
    shownAdd?: boolean;
    shownAll?: boolean;
  };
  
  type PermissionItem = {
    manager: string;
    add: boolean;
    edit: boolean;
    view: boolean;
    shownView: boolean;
    shownAdd: boolean;
    shownAll: boolean;
  };

  const generateManager = (manager: string, options: PermissionOption = {}): PermissionItem => ({
    manager,
    add: options.add ?? false,
    edit: options.edit ?? false,
    view: options.view ?? false,
    shownView: options.shownView ?? true,
    shownAdd: options.shownAdd ?? true,
    shownAll: options.shownAll ?? true,
  });

  
  const Permission: PermissionItem[] = [
    generateManager("dashboard"),
    generateManager("customer-manager"),
    generateManager("intentions-manager"),
    generateManager("email-manager"),
    generateManager("notification-manager"),
    generateManager("static-page-manager"),
    generateManager("FAQ"),
    generateManager("settings"),
  ];

  
  export default Permission;
