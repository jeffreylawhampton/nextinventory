import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET(request, { params: { id } }) {
  const { user } = await getSession();

  id = parseInt(id);
  const containers = await prisma.container.findMany({
    where: {
      user: {
        email: user.email,
      },
      OR: [
        { parentContainer: { id } },
        { parentContainer: { parentContainer: { id } } },
        { parentContainer: { parentContainer: { parentContainer: { id } } } },
        {
          parentContainer: {
            parentContainer: { parentContainer: { parentContainer: { id } } },
          },
        },
        {
          parentContainer: {
            parentContainer: {
              parentContainer: { parentContainer: { parentContainer: { id } } },
            },
          },
        },
        {
          parentContainer: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: { parentContainer: { id } },
                },
              },
            },
          },
        },
        {
          parentContainer: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: { parentContainer: { id } },
                  },
                },
              },
            },
          },
        },

        {
          parentContainer: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: {
                      parentContainer: { parentContainer: { id } },
                    },
                  },
                },
              },
            },
          },
        },

        {
          parentContainer: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: {
                      parentContainer: {
                        parentContainer: { parentContainer: { id } },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        {
          parentContainer: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: {
                      parentContainer: {
                        parentContainer: {
                          parentContainer: { parentContainer: { id } },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        {
          parentContainer: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: {
                      parentContainer: {
                        parentContainer: {
                          parentContainer: {
                            parentContainer: { parentContainer: { id } },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        {
          parentContainer: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: {
                      parentContainer: {
                        parentContainer: {
                          parentContainer: {
                            parentContainer: {
                              parentContainer: { parentContainer: { id } },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        {
          parentContainer: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: {
                      parentContainer: {
                        parentContainer: {
                          parentContainer: {
                            parentContainer: {
                              parentContainer: {
                                parentContainer: { parentContainer: { id } },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
    select: {
      id: true,
    },
  });

  const items = await prisma.item.findMany({
    where: {
      user: {
        email: user.email,
      },
      OR: [
        { container: { id } },
        { container: { parentContainer: { id } } },
        { container: { parentContainer: { parentContainer: { id } } } },
        {
          container: {
            parentContainer: { parentContainer: { parentContainer: { id } } },
          },
        },
        {
          container: {
            parentContainer: {
              parentContainer: { parentContainer: { parentContainer: { id } } },
            },
          },
        },
        {
          container: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: { parentContainer: { id } },
                },
              },
            },
          },
        },
        {
          container: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: { parentContainer: { id } },
                  },
                },
              },
            },
          },
        },

        {
          container: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: {
                      parentContainer: { parentContainer: { id } },
                    },
                  },
                },
              },
            },
          },
        },

        {
          container: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: {
                      parentContainer: {
                        parentContainer: { parentContainer: { id } },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        {
          container: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: {
                      parentContainer: {
                        parentContainer: {
                          parentContainer: { parentContainer: { id } },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        {
          container: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: {
                      parentContainer: {
                        parentContainer: {
                          parentContainer: {
                            parentContainer: { parentContainer: { id } },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        {
          container: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: {
                      parentContainer: {
                        parentContainer: {
                          parentContainer: {
                            parentContainer: {
                              parentContainer: { parentContainer: { id } },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        {
          container: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: {
                      parentContainer: {
                        parentContainer: {
                          parentContainer: {
                            parentContainer: {
                              parentContainer: {
                                parentContainer: { parentContainer: { id } },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
    select: {
      id: true,
    },
  });

  return Response.json({ containers, items });
}
