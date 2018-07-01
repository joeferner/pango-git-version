#include <stdio.h>
#include <version.h>

int main() {
  printf("GIT_HASH %s\n", GIT_HASH);
  printf("GIT_TAG %s\n", GIT_TAG);
  return 0;
}
