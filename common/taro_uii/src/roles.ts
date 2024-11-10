
import { BaseUserInfo } from "../types/type_user";
import { ROLE_KEY, ROLE_NAME, ROLE_ST } from './config';




// 角色判断函数
export function roo___has_role(userInfo: BaseUserInfo | null, _roles: ROLE_KEY[] = [], mode: "or" | "and" | "only" = "or"): boolean {
  // 检测团长的团长是否为团长自己
  const roles = userInfo?.roles ?? [];

  if (_roles && _roles instanceof Array && _roles.length > 0) {
    if (_roles.includes("*:*:*") && userInfo?.roles?.length) {
      return true;
    }
    const hasRole = {
      "or": () => roles.some(role => _roles.some(e => e === role.roleKey)),
      "and": () => roles.every(role => _roles.some(e => e === role.roleKey)),
      "only": () => roles.every(role => _roles.some(e => e === role.roleKey)) && roles.length === _roles.length,
    }[mode]();

    if (!hasRole) {
      return false;
    } else {
      return true;
    }
  } else {
    throw new Error(`请设置角色权限标签值"`);
  }
}
export function roo___has_permi(_roles: string[] = [], userInfo: BaseUserInfo | null,) {
  const permissions = userInfo?.permissions ?? [];
  if (_roles && _roles instanceof Array && _roles.length > 0) {
    const permissionFlag = _roles;

    const hasPermissions = permissions.some(permission => {
      return permissionFlag.includes(permission);
    });

    if (!hasPermissions) {
      return false;
    } else {
      return true;
    }
  } else {
    throw new Error(`请设置操作权限标签值`);
  }
}

// 新增角色
export function roo___role_add(userInfo: BaseUserInfo | null, roles: ROLE_ST[],): ROLE_ST[] {
  if (userInfo && userInfo.roles) {
    return [...new Set([...userInfo.roles, ...roles])];
  } else {
    return [...new Set([...roles])];
  }
}

// 删除角色
export function roo___role_sub(userInfo: BaseUserInfo | null, roles: ROLE_ST[],): ROLE_ST[] {
  if (userInfo && userInfo.roles) {
    return userInfo.roles?.filter(e => !roles.find(ee => ee === e));
  } else {
    return [];
  }
}

// 获取团长身份信息
export function roo___role_regiment(userInfo: BaseUserInfo) {
  return userInfo?.regimentInfo ?? null;
}

// 将权数字列表转化为汉字权限列表
export function roo___role_number2str(userInfo: BaseUserInfo) {
  return userInfo?.roles?.map(e => { return e.roleName; });
}

export function roo___role_getRoleInfo(userInfo: BaseUserInfo, roleName: ROLE_NAME) {
  return userInfo?.roles?.filter(e => e.roleName === roleName)[0];
}


