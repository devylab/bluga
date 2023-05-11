export class GlobalUtils {
  static dateFormatter(date: string) {
    return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
}
